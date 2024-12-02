import { addOrUpdateGroupMember } from "@/lib/db-utils/dynamo-queries";
import { UserId } from "@/types/globals";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    // get the auth session token of the requester
    const authRes = await auth();

    // update the user's ready status to false
    await addOrUpdateGroupMember((await params).groupId, authRes?.userId as UserId, {
      ready: false,
      promptAnswer: "",
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to set user prompt response" }, { status: 500 });
  }
}