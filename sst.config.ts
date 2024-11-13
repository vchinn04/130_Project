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
    const usersTable = new sst.aws.Dynamo("UsersTable", {
      fields: {
        userId: "string", // UUID
      },
      primaryIndex: { hashKey: "userId" },
      transform: {
        table: {
          billingMode: "PROVISIONED",
          readCapacity: 1,
          writeCapacity: 1,
        },
      },
    });

    const groupsTable = new sst.aws.Dynamo("GroupsTable", {
      fields: {
        groupId: "string", // UUID
      },
      primaryIndex: { hashKey: "groupId" },
      transform: {
        table: {
          billingMode: "PROVISIONED",
          readCapacity: 1,
          writeCapacity: 1,
        },
      },
    });

    // const teamsTable = new sst.aws.Dynamo("TeamsTable", {
    //   fields: {
    //     groupId: "string", // UUID linked from GroupsTable
    //     teamId: "number",
    //   },
    //   primaryIndex: { hashKey: "groupId", rangeKey: "teamId" },
    //   transform: {
    //     table: {
    //       billingMode: "PROVISIONED",
    //       readCapacity: 1,
    //       writeCapacity: 1,
    //     },
    //   },
    // });

    // const messagesTable = new sst.aws.Dynamo("MessagesTable", {
    //   fields: {
    //     chatInstanceId: "string", // either a groupId or a team Primary Key depending on the chat
    //     timestamp: "string",
    //     senderID: "string",
    //   },
    //   primaryIndex: { hashKey: "chatInstanceId", rangeKey: "timestamp" },
    //   // a better term would probably be "secondaryIndexes"
    //   transform: {
    //     table: {
    //       billingMode: "PROVISIONED",
    //       readCapacity: 1,
    //       writeCapacity: 1,
    //       globalSecondaryIndexes: [
    //         // This index is for querying all of the messages from a user from within given chat
    //         {
    //           name: "sendersIndexedByChat",
    //           hashKey: "chatInstanceId",
    //           rangeKey: "senderID",
    //           projectionType: "ALL",
    //           readCapacity: 1,
    //           writeCapacity: 1,
    //         },
    //       ],
    //     },
    //   },
    // });

    const NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = new sst.Secret("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
    const CLERK_SECRET_KEY = new sst.Secret("CLERK_SECRET_KEY");

    // Init the NextJS app resource cluster
    // Originally set up with these values (check the sst source for the actual current values):
    // DEFAULT_OPEN_NEXT_VERSION = "3.1.6";
    // DEFAULT_CACHE_POLICY_ALLOWED_HEADERS = ["x-open-next-cache-key"];
    const openNextDeployment = new sst.aws.Nextjs("MyWeb", {
      link: [
        // usersTable,
        // groupsTable,
        // teamsTable,
        // messagesTable
      ],
      environment: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.value,
        CLERK_SECRET_KEY: CLERK_SECRET_KEY.value
      },
      path: ".",
    });

    return {
      timestamp: new Date().toISOString(),
      // NextJS_Resources: openNextDeployment.nodes,
      // DynamoDB_Table_Resources: [
      //   { usersTable: usersTable.nodes },
      //   { groupsTable: groupsTable.nodes },
      //   { teamsTable: teamsTable.nodes },
      //   { messagesTable: messagesTable.nodes },
      // ],
    };
  },
});
