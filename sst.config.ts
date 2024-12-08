/* tslint:disable */
/* eslint-disable */
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "aws-nextjs",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },

  /* run() initializes and links the described resources when `dev' or `deploy` is run.

    The function runs every time the app is deployed or run locally in dev mode.
    Any return values are printed to the console as the output of the `dev` or
      `deploy` command, and are also written to `.sst/output.json`
  */
  async run() {
    /* Initialize DynamoDB tables.
      Note that these are not the complete schemas - they are just the fields that are
        are being used for indexing. Schemas will be defined under "types" in the app.

      Also Note:
        Identifiers are a bit different from AWS docs, but they match up like this:
        `PrimaryKey: { PartitionKey, SortKey }` <- docs syntax
        `primaryIndex: { hashKey, rangeKey }` <- SST syntax
    */

    const groupsTable = new sst.aws.Dynamo("GroupsTable", {
      fields: {
        groupId: "string", // UUID
        subTable: "string", // members | teams | info
      },
      primaryIndex: { hashKey: "groupId", rangeKey: "subTable" },
      transform: {
        table: {
          billingMode: "PROVISIONED",
          readCapacity: 1,
          writeCapacity: 1,
        },
      },
    });

    const promptAnswersBucket = new sst.aws.Bucket("PromptAnswersBucket", {
      public: false,
    });

    // All secret are provisioned in the Pulumi secrets manager on developer devices, then accessed
    // here during the build and deploy process.
    const NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = new sst.Secret("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
    const CLERK_SECRET_KEY = new sst.Secret("CLERK_SECRET_KEY");
    const OPENAI_API_KEY = new sst.Secret("OPENAI_API_KEY");
    const FIREBASE_API_KEY = new sst.Secret("FIREBASE_API_KEY");
    const FIREBASE_AUTH_DOMAIN = new sst.Secret("FIREBASE_AUTH_DOMAIN");
    const FIREBASE_PROJECT_ID = new sst.Secret("FIREBASE_PROJECT_ID");
    const FIREBASE_STORAGE_BUCKET = new sst.Secret("FIREBASE_STORAGE_BUCKET");
    const FIREBASE_MESSAGING_SENDER_ID = new sst.Secret("FIREBASE_MESSAGING_SENDER_ID");
    const FIREBASE_APP_ID = new sst.Secret("FIREBASE_APP_ID");
    const FIREBASE_MEASUREMENT_ID = new sst.Secret("FIREBASE_MEASUREMENT_ID");

    // Init the NextJS app resource cluster
    // Originally set up with these values (check the sst source for the actual current values):
    // DEFAULT_OPEN_NEXT_VERSION = "3.1.6";
    // DEFAULT_CACHE_POLICY_ALLOWED_HEADERS = ["x-open-next-cache-key"];
    const openNextDeployment = new sst.aws.Nextjs("MyWeb", {
      link: [
        groupsTable,
        promptAnswersBucket,
      ],
      environment: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.value,
        CLERK_SECRET_KEY: CLERK_SECRET_KEY.value,
        OPENAI_API_KEY: OPENAI_API_KEY.value,
        FIREBASE_API_KEY: FIREBASE_API_KEY.value,
        FIREBASE_AUTH_DOMAIN: FIREBASE_AUTH_DOMAIN.value,
        FIREBASE_PROJECT_ID: FIREBASE_PROJECT_ID.value,
        FIREBASE_STORAGE_BUCKET: FIREBASE_STORAGE_BUCKET.value,
        FIREBASE_MESSAGING_SENDER_ID: FIREBASE_MESSAGING_SENDER_ID.value,
        FIREBASE_APP_ID: FIREBASE_APP_ID.value,
        FIREBASE_MEASUREMENT_ID: FIREBASE_MEASUREMENT_ID.value,
      },
      path: ".",
    });

    return {
      timestamp: new Date().toISOString(),
      NextJS_Resources: openNextDeployment.nodes,
      DynamoDB_Table_Resources: [
        { groupsTable: groupsTable.nodes },
      ],
    };
  },
  console: {
    autodeploy: {
      // on git push to main event, build and deploy to production
      target(event) {
        if (
          event.type === "branch" &&
          event.branch === "main" &&
          event.action === "pushed"
         ) {
          return { stage: "production" };
        }
      },
      runner: {
        engine: "codebuild",
        architecture: "x86_64",
        compute: "medium",
        timeout: "0.2 hours",
      },
    },
  }
});
