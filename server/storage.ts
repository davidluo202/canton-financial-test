// Storage helpers supporting both AWS S3 and Manus built-in storage
// Automatically detects which storage backend to use based on environment variables

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ENV } from './_core/env';

type StorageBackend = 'aws-s3' | 'manus-builtin';

interface StorageConfig {
  backend: StorageBackend;
  // AWS S3 config
  s3Client?: S3Client;
  s3Bucket?: string;
  s3Region?: string;
  // Manus built-in config
  baseUrl?: string;
  apiKey?: string;
}

let storageConfig: StorageConfig | null = null;

function getStorageConfig(): StorageConfig {
  if (storageConfig) return storageConfig;

  // Check if AWS S3 is configured
  const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const awsS3Bucket = process.env.AWS_S3_BUCKET;
  const awsS3Region = process.env.AWS_S3_REGION || 'us-east-1';

  if (awsAccessKeyId && awsSecretAccessKey && awsS3Bucket) {
    console.log('[Storage] Using AWS S3 backend:', awsS3Bucket);
    storageConfig = {
      backend: 'aws-s3',
      s3Client: new S3Client({
        region: awsS3Region,
        credentials: {
          accessKeyId: awsAccessKeyId,
          secretAccessKey: awsSecretAccessKey,
        },
      }),
      s3Bucket: awsS3Bucket,
      s3Region: awsS3Region,
    };
    return storageConfig;
  }

  // Fall back to Manus built-in storage
  const baseUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;

  if (!baseUrl || !apiKey) {
    throw new Error(
      'Storage not configured: set either AWS S3 credentials (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET) or Manus credentials (BUILT_IN_FORGE_API_URL, BUILT_IN_FORGE_API_KEY)'
    );
  }

  console.log('[Storage] Using Manus built-in storage');
  storageConfig = {
    backend: 'manus-builtin',
    baseUrl: baseUrl.replace(/\/+$/, ''),
    apiKey,
  };
  return storageConfig;
}

// AWS S3 implementation
async function s3Put(
  config: StorageConfig,
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType: string
): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  const buffer = typeof data === 'string' ? Buffer.from(data) : Buffer.from(data);

  const command = new PutObjectCommand({
    Bucket: config.s3Bucket!,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: 'public-read', // Make files publicly accessible
  });

  await config.s3Client!.send(command);

  // Construct public URL
  const url = `https://${config.s3Bucket}.s3.${config.s3Region}.amazonaws.com/${key}`;
  return { key, url };
}

// Manus built-in storage implementation
function buildUploadUrl(baseUrl: string, relKey: string): URL {
  const url = new URL('v1/storage/upload', ensureTrailingSlash(baseUrl));
  url.searchParams.set('path', normalizeKey(relKey));
  return url;
}

async function buildDownloadUrl(
  baseUrl: string,
  relKey: string,
  apiKey: string
): Promise<string> {
  const downloadApiUrl = new URL(
    'v1/storage/downloadUrl',
    ensureTrailingSlash(baseUrl)
  );
  downloadApiUrl.searchParams.set('path', normalizeKey(relKey));
  const response = await fetch(downloadApiUrl, {
    method: 'GET',
    headers: buildAuthHeaders(apiKey),
  });
  return (await response.json()).url;
}

function toFormData(
  data: Buffer | Uint8Array | string,
  contentType: string,
  fileName: string
): FormData {
  const blob =
    typeof data === 'string'
      ? new Blob([data], { type: contentType })
      : new Blob([data as any], { type: contentType });
  const form = new FormData();
  form.append('file', blob, fileName || 'file');
  return form;
}

async function manusBuiltinPut(
  config: StorageConfig,
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType: string
): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  const uploadUrl = buildUploadUrl(config.baseUrl!, key);
  const formData = toFormData(data, contentType, key.split('/').pop() ?? key);
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: buildAuthHeaders(config.apiKey!),
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Storage upload failed (${response.status} ${response.statusText}): ${message}`
    );
  }
  const url = (await response.json()).url;
  return { key, url };
}

// Helper functions
function ensureTrailingSlash(value: string): string {
  return value.endsWith('/') ? value : `${value}/`;
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, '');
}

function buildAuthHeaders(apiKey: string): HeadersInit {
  return { Authorization: `Bearer ${apiKey}` };
}

// Public API
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = 'application/octet-stream'
): Promise<{ key: string; url: string }> {
  const config = getStorageConfig();

  if (config.backend === 'aws-s3') {
    return s3Put(config, relKey, data, contentType);
  } else {
    return manusBuiltinPut(config, relKey, data, contentType);
  }
}

export async function storageGet(
  relKey: string
): Promise<{ key: string; url: string }> {
  const config = getStorageConfig();
  const key = normalizeKey(relKey);

  if (config.backend === 'aws-s3') {
    // For AWS S3, construct public URL directly
    const url = `https://${config.s3Bucket}.s3.${config.s3Region}.amazonaws.com/${key}`;
    return { key, url };
  } else {
    // For Manus built-in, get presigned URL
    return {
      key,
      url: await buildDownloadUrl(config.baseUrl!, key, config.apiKey!),
    };
  }
}
