import { generateEmbeddingsWithContext, summarizeCluster } from "@/lib/ai/openai-utils";
import { balanceClusters, clusterEmbeddings } from "@/lib/ai/stats-utils";
import { getPromptAnswer } from "@/lib/db-utils/bucket-queries";
import { getGroupMembers } from "@/lib/db-utils/dynamo-queries";
import { UserId } from "@/types/globals";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ groupId: string, numClusters: number }> }
) {
  let k: number = 0;
  try {
    // get the auth session token of the requester
    // const { responses, numClusters, contextPrompt } = await req.json();
    const contextPrompt = "This is a class setting. Users are trying to form teams to work on a class project for the quarter, and need to be matched into teams that will work well together and have similar goals and interests.";
    const authRes = await auth();
    let { groupId, numClusters } = await params;

    k = numClusters;

    // get the members table from the database
    const membersSubtable = await getGroupMembers(groupId);
    if (!membersSubtable) {
      return Response.json({ error: "Group members subtable access failed" }, { status: 400 });
    }

    // go through the record of members in the subtable and, if the user is ready, get their prompt from the bucket and add it to a new map of userIds to prompts
    const members = membersSubtable.members;
    const responses: Record<UserId, string> = {};
    await Promise.all(
      Object.entries(members)
        .filter(([userId, member]) => member.ready)
        .map(async ([userId, member]) => {
          const prompt = await getPromptAnswer(groupId, userId);
          if (prompt) {
            responses[userId] = prompt;
          }
        })
    );

    // log all of the prompts
    console.log(responses);
    // these should be gotten from the database but this is a placeholder for now
    if (!responses || !numClusters || !contextPrompt) {
      return Response.json({ error: "something went wrong - responses could not be assembled." }, { status: 400 });
    }
    // get all of the prompts from the buckets of the active users for the team


    // another placeholder to make it only work with balanced teams for now
    const totalUsers = Object.keys(responses).length;
    if (totalUsers % numClusters !== 0) {
      return Response.json({ error: "Total users must be divisible by the number of clusters." }, { status: 400 });
    }

    const targetSize = totalUsers / numClusters;

    // Generate embeddings with context
    const embeddings = await generateEmbeddingsWithContext(responses, contextPrompt);

    // Perform initial clustering
    const initialClusters = await clusterEmbeddings(embeddings, numClusters);

    // Balance clusters for equal size
    const balancedClusters = balanceClusters(initialClusters, targetSize);

    // Generate summaries for each cluster
    const teams = await Promise.all(
      Object.entries(balancedClusters).map(async ([clusterID, members]) => {
        const summary = await summarizeCluster(members, contextPrompt);
        return {
          teamID: `Team-${clusterID}`,
          members,
          summary,
        };
      })
    );

    // update the teams table in the database with the new teams


    // return the teams to the client.
    return Response.json({ teams: teams }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: `Failed to generate teams: ${error} k: ${k}` }, { status: 500 });
  }
}
