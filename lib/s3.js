import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET_NAME } = process.env;

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION || !AWS_S3_BUCKET_NAME) {
  // Don't throw here to keep dev flow smooth — functions should fail with clear errors when used.
  console.warn('S3 environment variables are not fully configured. Upload/delete will fail until set.');
}

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadFileToS3(buffer, fileName, contentType = 'application/octet-stream') {
  if (!AWS_S3_BUCKET_NAME) throw new Error('AWS_S3_BUCKET_NAME is not configured');

  const key = `uploads/${Date.now()}-${fileName}`;

  const params = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  };

  try {
    await s3.send(new PutObjectCommand(params));
    return key;
  } catch (err) {
    console.error('S3 upload failed', err);
    throw err;
  }
}

export async function deleteFileFromS3(key) {
  if (!AWS_S3_BUCKET_NAME) throw new Error('AWS_S3_BUCKET_NAME is not configured');

  const params = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: key,
  };

  try {
    await s3.send(new DeleteObjectCommand(params));
    return true;
  } catch (err) {
    console.error('S3 delete failed', err);
    return false;
  }
}
