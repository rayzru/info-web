import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { env } from "~/env";
import { s3Logger } from "~/lib/logger";

/**
 * S3 Client configured for Timeweb Cloud S3-compatible storage
 *
 * Timeweb Cloud provides S3-compatible object storage.
 * Configuration based on official Timeweb examples:
 * https://github.com/timeweb-cloud/s3-examples
 */
export const s3Client = new S3Client({
  endpoint: env.S3_URL, // https://s3.twcstorage.ru
  region: env.S3_REGION, // ru-1
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
  // Force path-style URLs (required for Timeweb Cloud S3)
  forcePathStyle: true,
});

/**
 * Upload a file to S3
 *
 * @param buffer - File buffer to upload
 * @param key - S3 object key (path in bucket)
 * @param contentType - MIME type of the file
 * @param metadata - Optional metadata
 * @returns Public URL of the uploaded file
 */
export async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string,
  metadata?: Record<string, string>
): Promise<string> {
  try {
    s3Logger.debug({ key, size: buffer.length }, "Uploading to S3");

    const command = new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      // Note: ACL removed - many S3-compatible services don't support it
      // Files should be publicly accessible via bucket policy or custom domain
      Metadata: metadata,
    });

    await s3Client.send(command);

    // Construct public URL using custom domain if available
    // With custom domain: https://media.sr2.ru/key
    // Without: https://s3.twcstorage.ru/bucket-name/key
    const publicUrl = env.S3_PUBLIC_URL
      ? `${env.S3_PUBLIC_URL}/${key}`
      : `${env.S3_URL}/${env.S3_BUCKET}/${key}`;

    s3Logger.info({ key, publicUrl }, "Upload successful");
    return publicUrl;
  } catch (error) {
    s3Logger.error(
      {
        err: error,
        key,
        bucket: env.S3_BUCKET,
        endpoint: env.S3_URL,
      },
      "Upload failed"
    );
    throw new Error(
      `Failed to upload to S3: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Delete a file from S3
 *
 * @param key - S3 object key (path in bucket)
 * @returns True if deleted successfully
 */
export async function deleteFromS3(key: string): Promise<boolean> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: key,
    });

    await s3Client.send(command);
    s3Logger.info({ key }, "File deleted from S3");
    return true;
  } catch (error) {
    s3Logger.error({ err: error, key }, "Failed to delete from S3");
    return false;
  }
}

/**
 * Extract S3 key from a full URL
 *
 * @param url - Full S3 URL (can be custom domain or direct S3 URL)
 * @returns S3 key (path) or null if invalid
 */
export function extractS3Key(url: string): string | null {
  try {
    const urlObj = new URL(url);

    // Check if this is a custom domain URL (media.sr2.ru)
    if (env.S3_PUBLIC_URL && url.startsWith(env.S3_PUBLIC_URL)) {
      // Custom domain: https://media.sr2.ru/images/2026/02/file.jpg -> images/2026/02/file.jpg
      const path = urlObj.pathname.slice(1); // Remove leading slash
      return path || null;
    }

    // Direct S3 URL: https://s3.twcstorage.ru/bucket-name/images/2026/02/file.jpg
    // Remove leading slash and bucket name from pathname
    const parts = urlObj.pathname.split("/").filter(Boolean);
    if (parts.length > 1) {
      // Skip bucket name (first part), join the rest
      const path = parts.slice(1).join("/");
      return path || null;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Generate S3 key for uploads with date-based folder structure
 *
 * @param filename - Original or generated filename
 * @param options - Upload options
 * @param options.type - Content type: 'news', 'knowledge', 'publication', 'listing', 'media'
 * @param options.userId - User ID for private uploads (required for publications, listings, media)
 * @returns S3 key with proper structure based on content type
 *
 * Structure:
 * - Public: news/YYYY/MM/filename, knowledge/YYYY/MM/filename
 * - Private: users/{userId}/publications/YYYY/MM/filename
 */
export function generateS3Key(
  filename: string,
  options: {
    type: "news" | "knowledge" | "publication" | "listing" | "media" | "documents" | "images";
    userId?: string;
  }
): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  // Public content (no user folder)
  if (options.type === "news" || options.type === "knowledge") {
    return `${options.type}/${year}/${month}/${filename}`;
  }

  // Legacy support for backward compatibility
  if (options.type === "documents" || options.type === "images") {
    return `${options.type}/${year}/${month}/${filename}`;
  }

  // Private content (requires userId)
  if (!options.userId) {
    throw new Error(`userId is required for private uploads (type: ${options.type})`);
  }

  return `users/${options.userId}/${options.type}/${year}/${month}/${filename}`;
}
