import { clerkAddOwnedGroup } from "@/lib/user-utils/clerk-queries";
import { initializeGroup } from "@/lib/db-utils/dynamo-queries";
import { auth } from "@clerk/nextjs/server";
import { UserId } from "@/types/globals";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ groupName: string[] }> }
): Promise<Response> {
  // get the auth session token of the requester
  const authRes = await auth();
  const groupName = (await params).groupName;

  // Instantiate the new Group in the database
  let info, members, teams;
  try {
    ({ info, members, teams } = await initializeGroup(authRes?.userId as UserId, groupName[0]));

    // if an error is thrown in creating the group, return an error response (should be made more detailed)
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to initialize new group in DB - group not created" }, { status: 500 });
  }

  // add the group to the user's owned groups in clerk
  try {
    await clerkAddOwnedGroup(info.groupId);
    return Response.json({ info, members, teams }, { status: 200 });

    // if an error is thrown in adding the group to the user's owned groups in clerk, return an error response
    // we won't roll back the group creation, as that would just add more traffic to the server while it's already likely busy.
    // the orphaned group will be deleted by the cleanup lambda eventually.
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: `Failed to add groupID to user's owned groups in clerk - group not created: ${error}` },
      { status: 500 }
    );
  }
}
