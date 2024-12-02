import { uploadPromptAnswer } from "@/lib/db-utils/bucket-queries";
import { addOrUpdateGroupMember } from "@/lib/db-utils/dynamo-queries";
import { UserId } from "@/types/globals";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ groupId: string, promptResponse: string }> }
) {
  try {
    // get the auth session token of the requester
    const authRes = await auth();
    // const { promptResponse } = await req.json();

    // upload the prompt response to the bucket if one was provided.
    if ((await params).promptResponse) {
      await uploadPromptAnswer((await params).groupId, authRes?.userId as UserId, (await params).promptResponse);
    }

    await addOrUpdateGroupMember((await params).groupId, authRes?.userId as UserId, {
      ready: true,
      promptAnswer: "",
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to set user prompt response" }, { status: 500 });
  }
}