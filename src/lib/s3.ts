import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET = process.env.AWS_S3_BUCKET!;
const REGION = process.env.AWS_REGION!;

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  contentLength: number
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
    ContentLength: contentLength,
  });
  return getSignedUrl(s3, command, { expiresIn: 60 });
}

export function getPublicUrl(key: string): string {
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}

export async function deleteObject(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  await s3.send(command);
}

export async function deleteObjectsByPrefix(prefix: string): Promise<void> {
  const listCommand = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: prefix,
  });
  const result = await s3.send(listCommand);
  if (!result.Contents) return;

  for (const obj of result.Contents) {
    if (obj.Key) {
      await deleteObject(obj.Key);
    }
  }
}

export function extractKeyFromUrl(url: string): string | null {
  const prefix = `https://${BUCKET}.s3.${REGION}.amazonaws.com/`;
  if (url.startsWith(prefix)) {
    return url.slice(prefix.length);
  }
  return null;
}
