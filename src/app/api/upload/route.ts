import { NextRequest, NextResponse } from "next/server";

import { auth } from "~/server/auth";
import {
  processAndSaveImage,
  validateImageFile,
  type ImageProcessingOptions,
} from "~/lib/upload/image-processor";

/**
 * POST /api/upload
 *
 * Upload and process images.
 *
 * Form data:
 * - file: File (required) - The image file to upload
 * - keepOriginal: "true" | "false" - Skip processing, keep original
 * - maxWidth: number - Max width for resize (default: 1920)
 * - maxHeight: number - Max height for resize (default: 1080)
 * - quality: number - Output quality 1-100 (default: 85)
 * - addWatermark: "true" | "false" - Add watermark (default: true)
 * - outputFormat: "jpeg" | "png" | "webp" | "original" - Output format
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Parse options from form data
    const options: ImageProcessingOptions = {};

    const keepOriginal = formData.get("keepOriginal");
    if (keepOriginal === "true") {
      options.keepOriginal = true;
    }

    const maxWidth = formData.get("maxWidth");
    if (maxWidth) {
      const parsed = parseInt(maxWidth as string, 10);
      if (!isNaN(parsed) && parsed > 0) {
        options.maxWidth = parsed;
      }
    }

    const maxHeight = formData.get("maxHeight");
    if (maxHeight) {
      const parsed = parseInt(maxHeight as string, 10);
      if (!isNaN(parsed) && parsed > 0) {
        options.maxHeight = parsed;
      }
    }

    const quality = formData.get("quality");
    if (quality) {
      const parsed = parseInt(quality as string, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 100) {
        options.quality = parsed;
      }
    }

    const addWatermark = formData.get("addWatermark");
    if (addWatermark === "false") {
      options.addWatermark = false;
    }

    const outputFormat = formData.get("outputFormat");
    if (outputFormat && ["jpeg", "png", "webp", "original"].includes(outputFormat as string)) {
      options.outputFormat = outputFormat as ImageProcessingOptions["outputFormat"];
    }

    // Process and save image
    const result = await processAndSaveImage(file, file.name, options);

    return NextResponse.json({
      success: true,
      image: result,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/upload
 *
 * Returns upload configuration and limits
 */
export async function GET() {
  return NextResponse.json({
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedFormats: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    defaultOptions: {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 85,
      addWatermark: true,
      watermarkText: "sr2.ru",
      outputFormat: "webp",
    },
  });
}
