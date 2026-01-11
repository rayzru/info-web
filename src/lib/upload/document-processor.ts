import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

import {
  MAX_DOCUMENT_SIZE,
  MAX_DOCUMENTS_PER_CLAIM,
  SUPPORTED_DOCUMENT_FORMATS,
} from "./document-constants";

// Re-export constants for server-side usage
export { MAX_DOCUMENT_SIZE, MAX_DOCUMENTS_PER_CLAIM, SUPPORTED_DOCUMENT_FORMATS };

// ============================================================================
// Types
// ============================================================================

export interface ProcessedDocument {
  /** Generated unique ID */
  id: string;
  /** Filename with extension */
  filename: string;
  /** Relative path from public folder */
  relativePath: string;
  /** Full URL path */
  url: string;
  /** Original filename */
  originalFilename: string;
  /** File size in bytes */
  size: number;
  /** MIME type */
  mimeType: string;
  /** Thumbnail URL (for images only) */
  thumbnailUrl?: string;
}

export interface DocumentProcessingOptions {
  /** Custom filename (without extension) */
  customFilename?: string;
  /** Generate thumbnail for images (default: true) */
  generateThumbnail?: boolean;
  /** Thumbnail size (default: 200) */
  thumbnailSize?: number;
}

// ============================================================================
// Constants
// ============================================================================

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "documents");
const THUMBNAIL_SIZE = 200;

const MIME_TO_EXT: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// ============================================================================
// Main Processing Function
// ============================================================================

export async function processAndSaveDocument(
  file: File | Buffer,
  originalFilename: string,
  mimeType: string,
  options: DocumentProcessingOptions = {},
): Promise<ProcessedDocument> {
  const {
    customFilename,
    generateThumbnail = true,
    thumbnailSize = THUMBNAIL_SIZE,
  } = options;

  // Convert File to Buffer if needed
  const buffer =
    file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;

  // Generate unique ID
  const id = randomUUID();

  // Get current date for folder structure
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  // Create upload subdirectory: uploads/documents/YYYY/MM/
  const uploadSubdir = path.join(UPLOAD_DIR, String(year), month);
  await fs.mkdir(uploadSubdir, { recursive: true });

  // Determine extension from MIME type
  const extension = MIME_TO_EXT[mimeType] ?? "bin";

  // Generate filename
  const filename = customFilename
    ? `${customFilename}.${extension}`
    : `${id}.${extension}`;

  // Save file
  const filePath = path.join(uploadSubdir, filename);
  await fs.writeFile(filePath, buffer);

  // Get file stats
  const stats = await fs.stat(filePath);

  const relativePath = `/uploads/documents/${year}/${month}/${filename}`;

  // Generate thumbnail for images
  let thumbnailUrl: string | undefined;

  if (generateThumbnail && mimeType.startsWith("image/")) {
    try {
      const thumbnailFilename = `${id}_thumb.webp`;
      const thumbnailPath = path.join(uploadSubdir, thumbnailFilename);

      await sharp(buffer)
        .resize(thumbnailSize, thumbnailSize, {
          fit: "cover",
          position: "center",
        })
        .webp({ quality: 80 })
        .toFile(thumbnailPath);

      thumbnailUrl = `/uploads/documents/${year}/${month}/${thumbnailFilename}`;
    } catch (error) {
      console.error("Failed to generate thumbnail:", error);
      // Continue without thumbnail
    }
  }

  return {
    id,
    filename,
    relativePath,
    url: relativePath,
    originalFilename,
    size: stats.size,
    mimeType,
    thumbnailUrl,
  };
}

// ============================================================================
// Validation
// ============================================================================

export function validateDocumentFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!SUPPORTED_DOCUMENT_FORMATS.includes(file.type)) {
    return {
      valid: false,
      error: `Неподдерживаемый формат: ${file.type}. Поддерживаются: PDF, JPEG, PNG`,
    };
  }

  if (file.size > MAX_DOCUMENT_SIZE) {
    return {
      valid: false,
      error: `Файл слишком большой: ${(file.size / 1024 / 1024).toFixed(2)}MB. Максимум: ${MAX_DOCUMENT_SIZE / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}

// ============================================================================
// Delete Document
// ============================================================================

export async function deleteDocument(relativePath: string): Promise<boolean> {
  try {
    const filePath = path.join(process.cwd(), "public", relativePath);
    await fs.unlink(filePath);

    // Try to delete thumbnail if exists
    const thumbnailPath = filePath.replace(/\.[^.]+$/, "_thumb.webp");
    try {
      await fs.unlink(thumbnailPath);
    } catch {
      // Thumbnail might not exist, ignore error
    }

    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// Exports
// ============================================================================

export const documentProcessor = {
  process: processAndSaveDocument,
  validate: validateDocumentFile,
  delete: deleteDocument,
  SUPPORTED_FORMATS: SUPPORTED_DOCUMENT_FORMATS,
  MAX_FILE_SIZE: MAX_DOCUMENT_SIZE,
  MAX_DOCUMENTS: MAX_DOCUMENTS_PER_CLAIM,
};
