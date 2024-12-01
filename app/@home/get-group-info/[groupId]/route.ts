import { getGroupInfo } from "@/lib/db-utils/dynamo-queries";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
): Promise<Response> {
  const groupId = (await params).groupId;

  try {
    const group = await getGroupInfo(groupId);
    return Response.json(group, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to get user group info in request handler" }, { status: 500 }); // (should redirect to failure page)
  }
}
