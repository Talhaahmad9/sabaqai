import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fileName, fileType } = body || {};

    if (!fileName || !fileType) {
      return NextResponse.json({ message: 'fileName and fileType are required' }, { status: 400 });
    }

    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET_NAME } = process.env;
    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION || !AWS_S3_BUCKET_NAME) {
      console.warn('S3 environment variables missing');
      return NextResponse.json({ message: 'S3 not configured' }, { status: 500 });
    }

    const s3 = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    const key = `uploads/${Date.now()}-${fileName}`;

    const cmd = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const url = await getSignedUrl(s3, cmd, { expiresIn: 300 });

    return NextResponse.json({ url, key });
  } catch (err) {
    console.error('Presign error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
