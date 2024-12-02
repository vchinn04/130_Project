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
  const { clusters } = kmeans(data, 2, {
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