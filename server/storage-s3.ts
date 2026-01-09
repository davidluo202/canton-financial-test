// Direct AWS S3 storage implementation
// Replaces Manus Forge API with native AWS S3 SDK

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ENV } from "./_core/env";

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    const region = process.env.AWS_REGION || "ap-southeast-1";
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error(
        "AWS credentials missing: set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY"
      );
    }

    s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  return s3Client;
}

function getBucketName(): string {
  const bucketName = process.env.S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("S3 bucket name missing: set S3_BUCKET_NAME");
  }
  return bucketName;
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

/**
 * Upload data to AWS S3
 * @param relKey - Relative key/path in S3 bucket (e.g., "news/123456-abc.jpg")
 * @param data - Buffer, Uint8Array, or string to upload
 * @param contentType - MIME type (default: "application/octet-stream")
 * @returns Object with key and public URL
 */
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const client = getS3Client();
  const bucketName = getBucketName();
  const key = normalizeKey(relKey);
  const region = process.env.AWS_REGION || "ap-southeast-1";

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: data,
      ContentType: contentType,
      ACL: "public-read", // Allow public read access
    });

    await client.send(command);

    // Generate public URL
    const url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

    return { key, url };
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error(
      `S3 upload failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Get public URL for an S3 object
 * @param relKey - Relative key/path in S3 bucket
 * @returns Object with key and public URL
 */
export async function storageGet(
  relKey: string
): Promise<{ key: string; url: string }> {
  const bucketName = getBucketName();
  const key = normalizeKey(relKey);
  const region = process.env.AWS_REGION || "ap-southeast-1";

  // For public-read objects, we can directly construct the URL
  const url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

  return { key, url };
}
