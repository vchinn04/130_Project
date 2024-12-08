import { generateEmbeddingsWithContext, summarizeCluster, augmentResponsesWithCommentary } from "@/lib/ai/openai-utils";
import { balanceClusters, clusterEmbeddings, optimizeClusters } from "@/lib/ai/stats-utils";
import { getPromptAnswer } from "@/lib/db-utils/bucket-queries";
import { getGroupMembers, updateTeamsTable } from "@/lib/db-utils/dynamo-queries";
import { UserId } from "@/types/globals";
import { auth } from "@clerk/nextjs/server";
import { Team, TeamSubtable, TeamUniqueId } from "@/lib/db-utils/schemas";
import { v4 as uuidv4 } from "uuid";
import { clerkGetOwnedGroups } from "@/lib/user-utils/clerk-queries";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ groupId: string, numClusters: string, prompt: string }> }
) {
  let k: number = 0;
  try {
    // get the auth session token of the requester
    // const { responses, numClusters, contextPrompt } = await req.json();
    // const prompt = "This is a class setting. Users are trying to form teams to work on a class project for the quarter, and need to be matched into teams that will work well together and have similar goals and interests.";
    const { groupId, numClusters, prompt} = await params;
    const ownedGroups = await clerkGetOwnedGroups();
    if (!ownedGroups.includes(groupId)) {
      return Response.json({ error: "Only the Group Owner can generate teams." }, { status: 400 });
    }

    k = parseInt(numClusters, 10);

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
    console.log("prompt: ", prompt);
    console.log("number of clusters: ", numClusters);
    console.log(responses);
    // these should be gotten from the database but this is a placeholder for now
    if (!responses || !numClusters || !prompt) {
      return Response.json({ error: "something went wrong - responses could not be assembled." }, { status: 400 });
    }
    // get all of the prompts from the buckets of the active users for the team


    const totalUsers = Object.keys(responses).length;
    // another placeholder to make it only work with balanced teams for now
    // if (totalUsers % numClusters !== 0) {
    //   return Response.json({ error: "Total users must be divisible by the number of clusters." }, { status: 400 });
    // }

    const targetSize = totalUsers / k;

    // Augment responses with AI commentary
    const augmentedResponses = await augmentResponsesWithCommentary(responses, prompt);

    // Generate embeddings with context (using augmented responses)
    const embeddings = await generateEmbeddingsWithContext(augmentedResponses, prompt);

    // Perform initial clustering
    const initialClusters = await clusterEmbeddings(embeddings, k);

    // optimize clusters to balance membership and for similarity
    const optimizedClusters = optimizeClusters(initialClusters, embeddings, {
      targetSize,
      maxIterations: 50,
      similarityThreshold: 0.7
    });

    // Balance clusters for equal size
    // const balancedClusters = balanceClusters(initialClusters, targetSize);

    const teams: Team[] = await Promise.all(
      Object.entries(optimizedClusters).map(async ([clusterID, members]) => {
        // generate a summary for each cluster
        // const summary = await summarizeCluster(members, contextPrompt, responses);
        return {
          teamUniqueId: uuidv4(),
          members: members,
          // summary,
        } as Team;
      })
    );

    // update the teams table in the database with the new teams
    const teamsTable: TeamSubtable = {
      groupId: groupId,
      subTable: "teams",
      generatedAt: new Date(),
      teams: teams,
    };
    try {
      await updateTeamsTable(teamsTable);
    } catch (error) {
      console.error(error);
      return Response.json({ error: `Failed to update teams table: ${error}` }, { status: 500 });
    }

    // return the teams to the client.
    return Response.json(teamsTable, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: `Failed to generate teams: ${error} k: ${k}` }, { status: 500 });
  }
}
