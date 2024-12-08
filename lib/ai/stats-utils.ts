import { kmeans } from "ml-kmeans";

/**
 * Clusters the embeddings into a given number of clusters.
 * @param embeddings - The embeddings to cluster.
 * @param numClusters - The number of clusters to create.
 * @returns The clusters.
 */
export async function clusterEmbeddings(
  embeddings: Record<string, number[]>,
  numClusters: number
): Promise<Record<number, string[]>> {
  const data = Object.values(embeddings);

  // Perform K-Means clustering on the embeddings data
  const { clusters } = kmeans(data, numClusters, {
    initialization: "kmeans++",
  });

  // Map the clusters to the user IDs
  const clusterMap: Record<number, string[]> = {};
  clusters.forEach((clusterIndex: number, i: number) => {
    const userID = Object.keys(embeddings)[i];
    if (!clusterMap[clusterIndex]) clusterMap[clusterIndex] = [];
    clusterMap[clusterIndex].push(userID);
  });

  return clusterMap;
}

/**
 * Balances the clusters to have the same number of users while maintaining optimality of matchings.
 * @param clusters - The clusters to balance.
 * @param targetSize - The target size of each cluster.
 * @returns The balanced clusters.
 */
export function balanceClusters(
  clusters: Record<number, string[]>,
  targetSize: number
): Record<number, string[]> {
  const allUsers = Object.values(clusters).flat(); // Flatten all cluster members
  const balancedClusters: Record<number, string[]> = {};

  let currentCluster = 0;
  for (let i = 0; i < allUsers.length; i++) {
    if (!balancedClusters[currentCluster]) balancedClusters[currentCluster] = [];
    balancedClusters[currentCluster].push(allUsers[i]);

    if (balancedClusters[currentCluster].length === targetSize) {
      currentCluster++;
    }
  }

  return balancedClusters;
}


/**
 * Options for cluster optimization.
 */
export type ClusterOptimizationOptions = {
  targetSize: number;
  maxIterations?: number;
  similarityThreshold?: number;
}

/**
 * Optimizes clusters post k-means by balancing size while maintaining similarity.
 * @param clusters - Initial clusters from k-means
 * @param embeddings - Original embeddings used for clustering
 * @param options - Optimization options parameters
 * @param options.targetSize - The target size of each cluster
 * @param options.maxIterations - The maximum number of iterations to perform
 * @param options.similarityThreshold - The similarity threshold for moving members between clusters
 */
export function optimizeClusters(
  clusters: Record<number, string[]>,
  embeddings: Record<string, number[]>,
  options: ClusterOptimizationOptions
): Record<number, string[]> {
  const { targetSize, maxIterations = 100, similarityThreshold = 0.7 } = options;
  let optimizedClusters = { ...clusters };
  let iterations = 0;
  let improved = true;

  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;

    // Find oversized and undersized clusters
    const oversizedClusters = Object.entries(optimizedClusters)
      .filter(([_, members]) => members.length > targetSize)
      .map(([id]) => parseInt(id));

    const undersizedClusters = Object.entries(optimizedClusters)
      .filter(([_, members]) => members.length < targetSize)
      .map(([id]) => parseInt(id));

    // Try to balance clusters while maintaining similarity
    for (const sourceCluster of oversizedClusters) {
      for (const targetCluster of undersizedClusters) {
        const potentialMoves = findOptimalMoves(
          optimizedClusters[sourceCluster],
          optimizedClusters[targetCluster],
          embeddings,
          similarityThreshold
        );

        if (potentialMoves.length > 0) {
          // Move the most suitable member
          const memberToMove = potentialMoves[0];
          optimizedClusters[sourceCluster] = optimizedClusters[sourceCluster]
            .filter(m => m !== memberToMove);
          optimizedClusters[targetCluster].push(memberToMove);
          improved = true;
        }
      }
    }
  }

  return optimizedClusters;
}

/**
 * Finds optimal members to move between clusters based on similarity.
 */
function findOptimalMoves(
  sourceMembers: string[],
  targetMembers: string[],
  embeddings: Record<string, number[]>,
  similarityThreshold: number
): string[] {
  const potentialMoves: Array<{ member: string; score: number }> = [];

  for (const member of sourceMembers) {
    const memberEmbedding = embeddings[member];

    // Calculate average similarity with target cluster
    const avgSimilarity = targetMembers.reduce((sum, targetMember) => {
      return sum + cosineSimilarity(memberEmbedding, embeddings[targetMember]);
    }, 0) / targetMembers.length;

    // Calculate similarity with current cluster
    const currentClusterSimilarity = sourceMembers
      .filter(m => m !== member)
      .reduce((sum, sourceMember) => {
        return sum + cosineSimilarity(memberEmbedding, embeddings[sourceMember]);
      }, 0) / (sourceMembers.length - 1);

    // If member is more similar to target cluster and meets threshold
    if (avgSimilarity > similarityThreshold && avgSimilarity > currentClusterSimilarity) {
      potentialMoves.push({
        member,
        score: avgSimilarity
      });
    }
  }

  return potentialMoves
    .sort((a, b) => b.score - a.score)
    .map(move => move.member);
}

/**
 * Calculates cosine similarity between two embeddings
 */
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}