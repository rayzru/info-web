"use client";

import { useCallback, useRef, useState } from "react";

import {
  Check,
  Crop as CropIcon,
  FolderOpen,
  ImageIcon,
  Loader2,
  RotateCcw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { cn } from "~/lib/utils";
import type { Media } from "~/server/db/schema";

import { MediaLibrary } from "./media-library";

import "react-image-crop/dist/ReactCrop.css";

// ============================================================================
// Types
// ============================================================================

export interface ImageUploaderProps {
  /** Current image URL */
  value?: string | null;
  /** Callback when image changes */
  onChange: (url: string | null, media?: Media) => void;
  /** Label for the input */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Show crop option */
  enableCrop?: boolean;
  /** Aspect ratio for crop (e.g., 16/9) */
  aspectRatio?: number;
  /** Max width for resize */
  maxWidth?: number;
  /** Max height for resize */
  maxHeight?: number;
  /** Whether to allow original size upload */
  allowOriginal?: boolean;
  /** Add watermark (default: true) */
  addWatermark?: boolean;
  /** CSS class name */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

// ============================================================================
// Image Uploader Component
// ============================================================================

export function ImageUploader({
  value,
  onChange,
  label,
  placeholder = "Перетащите изображение или нажмите для выбора",
  enableCrop = true,
  aspectRatio,
  maxWidth = 1920,
  maxHeight = 1080,
  allowOriginal = true,
  addWatermark = true,
  className,
  disabled = false,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // States
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Crop states
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  // Media library
  const [libraryOpen, setLibraryOpen] = useState(false);

  // Options
  const [keepOriginal, setKeepOriginal] = useState(false);
  const [withWatermark, setWithWatermark] = useState(addWatermark);

  // ========================================
  // File handling
  // ========================================

  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null);

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Поддерживаются только JPEG, PNG, WebP и GIF");
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("Файл слишком большой (макс. 10MB)");
        return;
      }

      // If crop is enabled, show crop dialog
      if (enableCrop) {
        const reader = new FileReader();
        reader.onload = () => {
          setImageToCrop(reader.result as string);
          setOriginalFile(file);
          setCrop(undefined);
          setCompletedCrop(undefined);
          setCropDialogOpen(true);
        };
        reader.readAsDataURL(file);
      } else {
        // Upload directly
        await uploadFile(file);
      }
    },
    [enableCrop]
  );

  const uploadFile = async (file: File | Blob, filename?: string) => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file, filename ?? (file instanceof File ? file.name : "cropped.jpg"));

      if (keepOriginal) {
        formData.append("keepOriginal", "true");
      } else {
        formData.append("maxWidth", String(maxWidth));
        formData.append("maxHeight", String(maxHeight));
        formData.append("addWatermark", String(withWatermark));
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка загрузки");
      }

      onChange(data.image.url, data.media);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setIsUploading(false);
    }
  };

  // ========================================
  // Crop handling
  // ========================================

  const getCroppedImage = useCallback((): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!imgRef.current || !completedCrop) {
        reject(new Error("No image or crop"));
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("No canvas context"));
        return;
      }

      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;

      ctx.drawImage(
        imgRef.current,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob"));
          }
        },
        "image/jpeg",
        0.95
      );
    });
  }, [completedCrop]);

  const handleCropConfirm = async () => {
    if (completedCrop && originalFile) {
      try {
        const croppedBlob = await getCroppedImage();
        setCropDialogOpen(false);
        await uploadFile(croppedBlob, originalFile.name);
      } catch (err) {
        setError("Ошибка при обрезке изображения");
      }
    } else if (originalFile) {
      // No crop selected, upload original
      setCropDialogOpen(false);
      await uploadFile(originalFile);
    }
  };

  const handleSkipCrop = async () => {
    if (originalFile) {
      setCropDialogOpen(false);
      await uploadFile(originalFile);
    }
  };

  // ========================================
  // Drag & Drop
  // ========================================

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  // ========================================
  // Media Library
  // ========================================

  const handleLibrarySelect = (media: Media) => {
    onChange(media.url, media);
    setLibraryOpen(false);
  };

  // ========================================
  // Render
  // ========================================

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}

      {/* Current image preview */}
      {value ? (
        <div className="bg-muted group relative overflow-hidden rounded-lg border">
          <img src={value} alt="Preview" className="h-48 w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || isUploading}
            >
              <Upload className="mr-1 h-4 w-4" />
              Заменить
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setLibraryOpen(true)}
              disabled={disabled}
            >
              <FolderOpen className="mr-1 h-4 w-4" />
              Библиотека
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onChange(null)}
              disabled={disabled}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        /* Drop zone */
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
              <p className="text-muted-foreground text-sm">Загрузка...</p>
            </>
          ) : (
            <>
              <ImageIcon className="text-muted-foreground h-8 w-8" />
              <p className="text-muted-foreground text-center text-sm">{placeholder}</p>
              <div className="mt-2 flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" disabled={disabled}>
                  <Upload className="mr-1 h-4 w-4" />
                  Загрузить
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLibraryOpen(true);
                  }}
                  disabled={disabled}
                >
                  <FolderOpen className="mr-1 h-4 w-4" />
                  Библиотека
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-destructive text-sm">{error}</p>}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
          e.target.value = "";
        }}
        className="hidden"
        disabled={disabled}
      />

      {/* Crop Dialog */}
      <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CropIcon className="h-5 w-5" />
              Обрезка изображения
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Crop area */}
            {imageToCrop && (
              <div className="bg-muted flex max-h-[50vh] justify-center overflow-auto rounded-lg p-2">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspectRatio}
                >
                  <img ref={imgRef} src={imageToCrop} alt="Crop preview" className="max-h-[45vh]" />
                </ReactCrop>
              </div>
            )}

            {/* Options */}
            <div className="flex flex-wrap items-center gap-6 py-2">
              {allowOriginal && (
                <div className="flex items-center gap-2">
                  <Switch
                    id="keepOriginal"
                    checked={keepOriginal}
                    onCheckedChange={setKeepOriginal}
                  />
                  <Label htmlFor="keepOriginal" className="cursor-pointer">
                    Оригинальный размер
                  </Label>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Switch
                  id="withWatermark"
                  checked={withWatermark}
                  onCheckedChange={setWithWatermark}
                  disabled={keepOriginal}
                />
                <Label
                  htmlFor="withWatermark"
                  className={cn("cursor-pointer", keepOriginal && "opacity-50")}
                >
                  Водяной знак
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setCropDialogOpen(false);
                setImageToCrop(null);
                setOriginalFile(null);
              }}
            >
              <X className="mr-1 h-4 w-4" />
              Отмена
            </Button>
            <Button variant="outline" onClick={handleSkipCrop}>
              <RotateCcw className="mr-1 h-4 w-4" />
              Без обрезки
            </Button>
            <Button onClick={handleCropConfirm} disabled={isUploading}>
              {isUploading ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-1 h-4 w-4" />
              )}
              {completedCrop ? "Применить и загрузить" : "Загрузить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Media Library Dialog */}
      <MediaLibrary
        open={libraryOpen}
        onOpenChange={setLibraryOpen}
        onSelect={handleLibrarySelect}
      />
    </div>
  );
}
