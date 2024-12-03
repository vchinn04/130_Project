import { clerkGetOwnedGroups } from "@/lib/user-utils/clerk-queries";
import { updateGroupInfo } from "@/lib/db-utils/dynamo-queries";
import { group } from "console";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
): Promise<Response> {
  const groupId = (await params).groupId;
  // console.log("groupId:", groupId);
  // const body = await request.json();
  // console.log("group request:", body);
  try {
    // if the groupId is not in the user's owned groups, return a permission error
    const groups = await clerkGetOwnedGroups();
    if (!groups.includes(groupId)) {
      return Response.json({ error: "User does not have permission to update this group - not its owner" }, { status: 403 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to get user group metadata in request handler" }, { status: 500 });
  }

  // update the group info in the database
  
  try {
    const body = await request.json();
    // console.log("body", body);
    await updateGroupInfo(groupId, body);
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: `Failed to update group info in database: ${error}` }, { status: 500 });
  }
}
