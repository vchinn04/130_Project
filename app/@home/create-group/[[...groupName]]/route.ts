import { clerkAddOwnedGroup } from "@/lib/user-utils/clerk-queries";
import { addOrUpdateGroupMember, createGroupInfo, deleteGroupInfo, deleteGroupMembers, initializeGroupMembers } from "@/lib/db-utils/dynamo-queries";
import { auth } from "@clerk/nextjs/server";
import { UserId } from "@/types/globals";
import { GroupInfoSubtable, GroupMembersSubtable } from "@/lib/db-utils/schemas";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: Request, { params }: { params: Promise<{ groupName: string[] }> }) {
  // get the auth session token of the requester
  const { sessionClaims } = await auth();
  const groupName = (await params).groupName;

  // Instantiate the new Group in the database
  let newGroup: GroupInfoSubtable | undefined = undefined;
  try {
    newGroup = await createGroupInfo(sessionClaims?.userId as UserId, groupName[0]);

    // if an error is thrown in adding the user to the group, return an error response (should be made more detailed)
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to initialize new group - group not created" }, { status: 500 });
  }

  // initialize the members list for the group in the database
  let newMembersRecord: GroupMembersSubtable | undefined = undefined;
  try {
    newMembersRecord = await initializeGroupMembers(newGroup?.groupId, sessionClaims?.userId as UserId);

    // if this operation fails, roll-back the group creation and return an error response
  } catch (error) {
    console.error(error);
    await deleteGroupInfo(newGroup?.groupId);
    return Response.json({ error: "Failed to initialize group members - group not created" }, { status: 500 });
  }

  // add the group to the user's owned groups in clerk
  try {
    await clerkAddOwnedGroup(newGroup?.groupId);
    return Response.json({ group: newGroup, members: newMembersRecord }, { status: 200 });

    // if this operation fails, roll-back the group creation and return an error response
  } catch (error) {
    console.error(error);
    await deleteGroupInfo(newGroup?.groupId);
    await deleteGroupMembers(newGroup?.groupId);
    return Response.json({ error: "Failed to add group to clerk - group not created" }, { status: 500 });
  }
}
