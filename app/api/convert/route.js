import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import Material from "@/lib/models/Material";
import { convertPptToPdfFromS3 } from "@/lib/cloudconvert";
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

    const body = await request.json();
    const { s3Key, fileName, subject } = body || {};

    if (!s3Key || !fileName) {
      return NextResponse.json(
        { message: "s3Key and fileName are required" },
        { status: 400 },
      );
    }

    // Convert PPT to PDF
    const converted = await convertPptToPdfFromS3(s3Key, fileName);
    const { pdfS3Key, pdfFileName } = converted;

    // Trigger Bedrock KB ingestion (best-effort)
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

        const cmd = new StartIngestionJobCommand({
          knowledgeBaseId: BEDROCK_KB_ID,
          dataSourceId: BEDROCK_DS_ID,
          clientToken: `${Date.now()}-${Math.random().toString(36).slice(2, 14)}-${Math.random().toString(36).slice(2, 14)}`,
        });

        await client.send(cmd);
      } else {
        console.warn(
          "Bedrock ingestion skipped: environment variables missing",
        );
      }
    } catch (err) {
      console.error("Bedrock ingestion error:", err);
      // don't fail the whole conversion if ingestion fails
    }

    // Save material in DB
    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const saved = await Material.create({
      userId: user._id,
      fileName: pdfFileName,
      fileSize: converted.pdfSize,
      s3Key: pdfS3Key,
      subject: subject || "General",
    });

    return NextResponse.json(
      { success: true, material: JSON.parse(JSON.stringify(saved)) },
      { status: 201 },
    );
  } catch (error) {
    console.error("Convert error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
