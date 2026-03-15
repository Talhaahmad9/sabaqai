import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function getS3DownloadUrl(key) {
  const cmd = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  });
  return await getSignedUrl(s3, cmd, { expiresIn: 600 });
}

export async function convertPptToPdfFromS3(s3Key, fileName) {
  const apiKey = process.env.CLOUDCONVERT_API_KEY;

  // Get a signed download URL for the PPT in S3
  const downloadUrl = await getS3DownloadUrl(s3Key);

  // Step 1 — Create job: import from URL + convert + export
  const jobRes = await fetch("https://api.cloudconvert.com/v2/jobs", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tasks: {
        "import-file": {
          operation: "import/url",
          url: downloadUrl,
          filename: fileName,
        },
        "convert-file": {
          operation: "convert",
          input: "import-file",
          output_format: "pdf",
        },
        "export-file": {
          operation: "export/url",
          input: "convert-file",
        },
      },
    }),
  });

  const job = await jobRes.json();

  if (!job?.data?.id) {
    throw new Error("CloudConvert job creation failed");
  }

  // Step 2 — Poll for completion
  let exportTask = null;
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 2000));

    const statusRes = await fetch(
      `https://api.cloudconvert.com/v2/jobs/${job.data.id}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      },
    );
    const status = await statusRes.json();

    const finished = status.data.tasks.find(
      (t) => t.name === "export-file" && t.status === "finished",
    );
    if (finished) {
      exportTask = finished;
      break;
    }

    const failed = status.data.tasks.find((t) => t.status === "error");
    if (failed) throw new Error(`CloudConvert error: ${failed.message}`);
  }

  if (!exportTask) throw new Error("CloudConvert timeout");

  // Step 3 — Download the converted PDF
  const pdfUrl = exportTask.result.files[0].url;
  const pdfRes = await fetch(pdfUrl);
  const pdfBuffer = Buffer.from(await pdfRes.arrayBuffer());
  const pdfFileName = fileName.replace(/\.pptx?$/i, ".pdf");
  const pdfS3Key = `uploads/${Date.now()}-${pdfFileName}`;

  // Step 4 — Upload PDF to S3
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: pdfS3Key,
      Body: pdfBuffer,
      ContentType: "application/pdf",
    }),
  );

  return { pdfS3Key, pdfFileName, pdfSize: pdfBuffer.length };
}
