"use client";

import { useState, useCallback } from "react";

// ============================================================================
// Types
// ============================================================================

export interface UploadOptions {
  /** Skip resizing and watermark, keep original */
  keepOriginal?: boolean;
  /** Max width for resizing (default: 1920) */
  maxWidth?: number;
  /** Max height for resizing (default: 1080) */
  maxHeight?: number;
  /** JPEG/WebP quality 1-100 (default: 85) */
  quality?: number;
  /** Add watermark (default: true) */
  addWatermark?: boolean;
  /** Output format */
  outputFormat?: "jpeg" | "png" | "webp" | "original";
}

export interface UploadedImage {
  id: string;
  filename: string;
  relativePath: string;
  url: string;
  originalFilename: string;
  size: number;
  width: number;
  height: number;
  mimeType: string;
}

export interface UseImageUploadResult {
  /** Upload a single file */
  upload: (file: File, options?: UploadOptions) => Promise<UploadedImage>;
  /** Upload multiple files */
  uploadMultiple: (files: File[], options?: UploadOptions) => Promise<UploadedImage[]>;
  /** Whether an upload is in progress */
  isUploading: boolean;
  /** Upload progress (0-100) for multiple uploads */
  progress: number;
  /** Last error message */
  error: string | null;
  /** Clear error */
  clearError: () => void;
}

// ============================================================================
// Hook
// ============================================================================

export function useImageUpload(): UseImageUploadResult {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const upload = useCallback(async (
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadedImage> => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      if (options.keepOriginal) {
        formData.append("keepOriginal", "true");
      }
      if (options.maxWidth) {
        formData.append("maxWidth", String(options.maxWidth));
      }
      if (options.maxHeight) {
        formData.append("maxHeight", String(options.maxHeight));
      }
      if (options.quality) {
        formData.append("quality", String(options.quality));
      }
      if (options.addWatermark === false) {
        formData.append("addWatermark", "false");
      }
      if (options.outputFormat) {
        formData.append("outputFormat", options.outputFormat);
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      return data.image;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const uploadMultiple = useCallback(async (
    files: File[],
    options: UploadOptions = {}
  ): Promise<UploadedImage[]> => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    const results: UploadedImage[] = [];
    const errors: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        try {
          const result = await upload(files[i]!, options);
          results.push(result);
        } catch (err) {
          errors.push(`${files[i]!.name}: ${err instanceof Error ? err.message : "Failed"}`);
        }
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }

      if (errors.length > 0) {
        setError(`Some uploads failed: ${errors.join(", ")}`);
      }

      return results;
    } finally {
      setIsUploading(false);
    }
  }, [upload]);

  return {
    upload,
    uploadMultiple,
    isUploading,
    progress,
    error,
    clearError,
  };
}
