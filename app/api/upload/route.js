import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Material from '@/lib/models/Material';
import { uploadFileToS3 } from '@/lib/s3';
import { BedrockAgentClient, StartIngestionJobCommand } from '@aws-sdk/client-bedrock-agent';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    const contentType = file.type || '';
    const fileSize = file.size || 0;

    // Validate PDF and size (max 10MB)
    const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
    if (contentType !== 'application/pdf') {
      return NextResponse.json({ message: 'Only PDF files are allowed' }, { status: 400 });
    }
    if (fileSize > MAX_BYTES) {
      return NextResponse.json({ message: 'File is too large (max 10MB)' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to S3
    const s3Key = await uploadFileToS3(buffer, file.name, contentType);

    // Trigger Bedrock KB ingestion (best-effort)
    try {
      const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BEDROCK_KB_ID, BEDROCK_DS_ID } = process.env;
      if (AWS_REGION && AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY && BEDROCK_KB_ID && BEDROCK_DS_ID) {
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
          // provide a simple config; real ingestion may require more fields
          clientToken: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        });

        await client.send(cmd);
      } else {
        console.warn('Bedrock ingestion skipped: environment variables missing');
      }
    } catch (err) {
      console.error('Bedrock ingestion error:', err);
      // don't fail the whole upload if ingestion fails
    }

    // Save material in DB
    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const saved = await Material.create({
      userId: user._id,
      fileName: file.name,
      fileSize,
      s3Key,
      subject: 'General',
    });

    return NextResponse.json({ success: true, material: JSON.parse(JSON.stringify(saved)) }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
