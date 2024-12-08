import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Augments responses with commentary from GPT-4.
 * @param responses - A record of user Identifiers to their responses.
 * @param contextPrompt - The prompt to use as context for the analysis.
 * @returns A record of user Identifiers with their responses and commentary.
 */
export async function augmentResponsesWithCommentary(
  responses: Record<string, string>,
  contextPrompt: string
): Promise<Record<string, string>> {
  const augmentedResponses = await Promise.all(
    Object.entries(responses).map(async ([userId, response]) => {
      const prompt = `
        Context: ${contextPrompt}

        Original Response: ${response}

        Provide a brief, specific analysis of this response in relation to the context. Focus on:
        1. Key strengths or unique qualities mentioned
        2. Potential team contribution areas
        3. Any notable alignment or misalignment with the context

        Keep your analysis concise, direct, and specific. Do not use generic language.`;

      const completionResponse = await openai.chat.completions.create({
        model: "gpt-4o-2024-11-20",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
      });

      const commentary = completionResponse.choices[0].message.content?.trim() ?? "";
      return [userId, `${response}\n\nAnalysis:\n${commentary}`] as const;
    })
  );

  return Object.fromEntries(augmentedResponses);
}

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

// export async function summarizeCluster(
//   members: string[],
//   contextPrompt: string
// ): Promise<string> {
//   const prompt = `
//     Context: ${contextPrompt}
//     Given the following team members: ${members.join(", ")}, summarize the team's strengths, potential focus areas, and how they align with the context.
//   `;

//   const completionResponse = await openai.chat.completions.create({
//     model: "gpt-4o-2024-11-20",
//     messages: [{ role: "user", content: prompt }],
//     max_tokens: 200,
//   });

//   return completionResponse.choices[0].message.content?.trim() ?? "";
// }

export async function summarizeCluster(
  members: string[],
  contextPrompt: string,
  responses: Record<string, string> // Add responses parameter
): Promise<string> {
  // Gather all responses from cluster members
  const clusterResponses = members
    .map((memberId) => responses[memberId])
    .filter(Boolean)
    .join("\n\n");

  const prompt = `
    Context: ${contextPrompt}

    Team Member Responses:
    ${clusterResponses}

    Based on the above responses, provide a very brief and concise summary of:
    2. Their collective complementary traits
    3. A suggestion for the team relevant to the context

    Keep the summary focused and brief. Do not identify individual team members.
    be blunt, specific, and do not speak as though you are responding to this prompt.
    Do not use vague language. provide highly specific commentary or nothing.
  `;

  const completionResponse = await openai.chat.completions.create({
    model: "gpt-4o-2024-11-20", // Updated to latest model
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
  });

  return completionResponse.choices[0].message.content?.trim() ?? "";
}
