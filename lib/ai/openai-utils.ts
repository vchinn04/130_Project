import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate embeddings for a given set of responses with a context prompt.
 * @param responses - A record of user IDs to their responses.
 * @param contextPrompt - The prompt to use as context for the embeddings.
 * @returns A record of user IDs with their embeddings.
 */
export async function generateEmbeddingsWithContext(
  responses: Record<string, string>,
  contextPrompt: string
): Promise<Record<string, number[]>> {
  const entries = Object.entries(responses);

  const embeddingResults = await Promise.all(
    entries.map(async ([userID, response]) => {
      const contextualResponse = `${contextPrompt}\n${response}`;
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-large",
        input: contextualResponse,
      });

      return [userID, embeddingResponse.data[0].embedding] as const;
    })
  );

  return Object.fromEntries(embeddingResults);
}


export async function summarizeCluster(
  members: string[],
  contextPrompt: string
): Promise<string> {
  const prompt = `
    Context: ${contextPrompt}
    Given the following team members: ${members.join(", ")}, summarize the team's strengths, potential focus areas, and how they align with the context.
  `;

  const completionResponse = await openai.chat.completions.create({
    model: "gpt-4o-2024-11-20",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
  });

  return completionResponse.choices[0].message.content?.trim() ?? "";
}
