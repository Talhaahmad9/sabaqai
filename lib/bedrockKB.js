import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

const client = new BedrockAgentRuntimeClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function queryKnowledgeBase(
  question,
  sessionId,
  language = "english",
) {
  const systemPrompt =
    language === "roman-urdu"
      ? "Aap ek helpful tutor hain. Hamesha Roman Urdu mein jawab dein. Simple aur friendly language use karein jaise ek classmate baat karta hai."
      : "You are a helpful tutor. Answer clearly and concisely based only on the provided context.";

  const input = {
    input: { text: question },
    retrieveAndGenerateConfiguration: {
      type: "KNOWLEDGE_BASE",
      knowledgeBaseConfiguration: {
        knowledgeBaseId: process.env.BEDROCK_KB_ID,
        modelArn: `arn:aws:bedrock:ap-south-1:163859990348:inference-profile/apac.amazon.nova-lite-v1:0`,
        generationConfiguration: {
          promptTemplate: {
            textPromptTemplate: `${systemPrompt}\n\nContext:\n$search_results$\n\nQuestion: ${question}\n\nAnswer:`,
          },
        },
        retrievalConfiguration: {
          vectorSearchConfiguration: {
            numberOfResults: 5,
            overrideSearchType: "HYBRID",
          },
        },
      },
    },
  };

  const res = await client.send(new RetrieveAndGenerateCommand(input));

  console.log(
    "Full KB response citations:",
    JSON.stringify(res?.citations, null, 2),
  );

  const answer = res?.output?.text || "";
  const citations =
    res?.citations?.flatMap(
      (c) =>
        c.retrievedReferences?.map((r) => ({
          pageContent: r.content?.text?.slice(0, 100) || "",
          location: r.location?.s3Location?.uri || "",
          pageNumber: r.metadata?.["x-amz-bedrock-kb-chunk-id"] || null,
        })) || [],
    ) || [];

  return { answer, citations, sessionId: res?.sessionId };
}
