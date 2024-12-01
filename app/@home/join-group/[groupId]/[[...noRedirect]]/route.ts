import { clerkAddJoinedGroup, clerkGetAllGroups } from "@/lib/user-utils/clerk-queries";
import { addOrUpdateGroupMember } from "@/lib/db-utils/dynamo-queries";
import { auth } from "@clerk/nextjs/server";
import { UserId } from "@/types/globals";

export async function GET(request: Request, { params }: { params: Promise<{ groupId: string, noRedirect: string[] }> }) {
  const { groupId, noRedirect } = await params;

  try {
    // if the groupId is already in the user's joined or owned groups, just return to the home page
    const groups = await clerkGetAllGroups();
    if (groups.includes(groupId)) {
      return Response.redirect(new URL("/", request.url), 307);
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to get user group metadata in request handler" }, { status: 500 }); // (should redirect to failure page)
  }

  // otherwise, try to add the user to the group in the database
  const { sessionClaims } = await auth();
  try {
    await addOrUpdateGroupMember(groupId, sessionClaims?.userId as UserId, {
      ready: false,
      promptAnswer: "",
    });
    await clerkAddJoinedGroup(groupId);
    return Response.redirect(new URL("/", request.url), 307);

    // if an error is thrown in adding the user to the group, return an error response (should be made more detailed)
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to join group" }, { status: 500 }); // should redirect to failure page
  }
}