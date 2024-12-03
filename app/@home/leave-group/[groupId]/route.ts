import { leaveGroup } from "@/lib/db-utils/dynamo-queries";
import { auth } from "@clerk/nextjs/server";
import { UserId } from "@/types/globals";
export async function GET(
    request: Request,
    { params }: { params: Promise<{ groupId: string }> }
): Promise<Response> {
    const authRes = await auth();
    const groupId = (await params).groupId;

    try {
        await leaveGroup(authRes?.userId as UserId,groupId);
        return Response.json({ message: "Successfully left the group" }, { status: 200 });
    } catch (e: any) {
        console.error(e);
        return Response.json({ error: e.message }, { status: 500 }); // (should redirect to failure page)
    }
}