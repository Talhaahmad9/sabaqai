import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function chatWithNova(messages = [], systemPrompt = "") {
  const cmd = new ConverseCommand({
    modelId: "amazon.nova-lite-v1:0",
    system: [{ text: systemPrompt }],
    messages: messages.map((m) => ({
      role: m.role,
      content: [{ text: m.content }],
    })),
    inferenceConfig: {
      maxTokens: 1000,
      temperature: 0.7,
    },
  });

  const res = await client.send(cmd);
  return res?.output?.message?.content?.[0]?.text || "";
}
