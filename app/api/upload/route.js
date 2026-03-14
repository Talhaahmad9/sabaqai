import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import Material from "@/lib/models/Material";
import {
  BedrockAgentClient,
  StartIngestionJobCommand,
} from "@aws-sdk/client-bedrock-agent";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { fileName, fileSize, fileType, s3Key, subject } =
      await request.json();

    if (!fileName || !s3Key) {
      return NextResponse.json(
        { message: "fileName and s3Key are required" },
        { status: 400 },
      );
    }

    // Trigger Bedrock KB sync
    try {
      const {
        AWS_REGION,
        AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY,
        BEDROCK_KB_ID,
        BEDROCK_DS_ID,
      } = process.env;
      if (
        AWS_REGION &&
        AWS_ACCESS_KEY_ID &&
        AWS_SECRET_ACCESS_KEY &&
        BEDROCK_KB_ID &&
        BEDROCK_DS_ID
      ) {
        const client = new BedrockAgentClient({
          region: AWS_REGION,
          credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
          },
        });
        await client.send(
          new StartIngestionJobCommand({
            knowledgeBaseId: BEDROCK_KB_ID,
            dataSourceId: BEDROCK_DS_ID,
            clientToken: `${Date.now()}-${Math.random().toString(36).slice(2, 14)}-${Math.random().toString(36).slice(2, 14)}`,
          }),
        );
      }
    } catch (err) {
      console.error("Bedrock ingestion error:", err);
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const saved = await Material.create({
      userId: user._id,
      fileName,
      fileSize,
      s3Key,
      subject: subject || "General",
    });

    return NextResponse.json(
      { success: true, material: JSON.parse(JSON.stringify(saved)) },
      { status: 201 },
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
