/**
 * Cron job для удаления документов заявок, помеченных для удаления
 * Запускается ежедневно через GitHub Actions
 *
 * Usage:
 *   bun run src/scripts/cron/cleanup-claim-documents.ts
 */

import { eq, lte } from "drizzle-orm";

import { deleteFromS3, extractS3Key } from "~/lib/s3/client";
import { db } from "~/server/db";
import { claimDocuments } from "~/server/db/schema";

interface CleanupResult {
  total: number;
  deleted: number;
  errors: number;
  errorDetails: Array<{ id: string; error: string }>;
}

export async function cleanupClaimDocuments(): Promise<CleanupResult> {
  const now = new Date();

  console.log(`[Cleanup] Starting document cleanup at ${now.toISOString()}`);

  // Найти все документы, у которых scheduledForDeletion <= now
  const documentsToDelete = await db
    .select()
    .from(claimDocuments)
    .where(lte(claimDocuments.scheduledForDeletion, now));

  console.log(`[Cleanup] Found ${documentsToDelete.length} documents to delete`);

  let successCount = 0;
  let errorCount = 0;
  const errorDetails: Array<{ id: string; error: string }> = [];

  for (const doc of documentsToDelete) {
    try {
      console.log(`[Cleanup] Deleting document ${doc.id}: ${doc.fileName}`);

      // Удалить основной файл из S3
      if (doc.fileUrl) {
        const s3Key = extractS3Key(doc.fileUrl);
        if (s3Key) {
          const deleted = await deleteFromS3(s3Key);
          if (deleted) {
            console.log(`[Cleanup] Deleted file from S3: ${s3Key}`);
          } else {
            console.warn(`[Cleanup] Failed to delete file from S3: ${s3Key}`);
          }
        }
      }

      // Удалить thumbnail если есть
      if (doc.thumbnailUrl) {
        const thumbnailKey = extractS3Key(doc.thumbnailUrl);
        if (thumbnailKey) {
          const deleted = await deleteFromS3(thumbnailKey);
          if (deleted) {
            console.log(`[Cleanup] Deleted thumbnail from S3: ${thumbnailKey}`);
          } else {
            console.warn(`[Cleanup] Failed to delete thumbnail from S3: ${thumbnailKey}`);
          }
        }
      }

      // Удалить запись из БД
      await db.delete(claimDocuments).where(eq(claimDocuments.id, doc.id));

      console.log(`[Cleanup] Successfully deleted document ${doc.id}`);
      successCount++;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error(`[Cleanup] Failed to delete document ${doc.id}:`, errorMessage);
      errorDetails.push({ id: doc.id, error: errorMessage });
      errorCount++;
    }
  }

  const result: CleanupResult = {
    total: documentsToDelete.length,
    deleted: successCount,
    errors: errorCount,
    errorDetails,
  };

  console.log(
    `[Cleanup] Cleanup complete: ${successCount} deleted, ${errorCount} errors out of ${result.total} total`
  );

  if (errorDetails.length > 0) {
    console.error("[Cleanup] Error details:", JSON.stringify(errorDetails, null, 2));
  }

  return result;
}

// Если запущен напрямую
// Check if running as main module
const isMainModule = typeof require !== "undefined" && require.main === module;

if (isMainModule) {
  void cleanupClaimDocuments()
    .then((result) => {
      console.log("[Cleanup] Result:", JSON.stringify(result, null, 2));

      // Exit with error code if there were errors
      if (result.errors > 0) {
        console.error(`[Cleanup] Exiting with error code 1 due to ${result.errors} errors`);
        process.exit(1);
      }

      process.exit(0);
    })
    .catch((error) => {
      console.error("[Cleanup] Fatal error:", error);
      process.exit(1);
    });
}
