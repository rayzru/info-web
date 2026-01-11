"use client";

import { useState, useRef, useCallback } from "react";
import {
  FileText,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Upload,
  X,
  AlertCircle,
  Info,
  ShieldCheck,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/components/ui/alert";
import { Card, CardContent } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { cn } from "~/lib/utils";
import {
  MAX_DOCUMENT_SIZE,
  MAX_DOCUMENTS_PER_CLAIM,
  SUPPORTED_DOCUMENT_FORMATS,
} from "~/lib/upload/document-constants";

// ============================================================================
// Types
// ============================================================================

export type DocumentType = "egrn" | "contract" | "passport" | "other";

export interface UploadedDocument {
  id: string;
  documentType: DocumentType;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  mimeType: string;
  thumbnailUrl?: string;
}

export interface ClaimDocumentUploaderProps {
  /** List of uploaded documents */
  documents: UploadedDocument[];
  /** Callback when documents change */
  onChange: (documents: UploadedDocument[]) => void;
  /** Whether the uploader is disabled */
  disabled?: boolean;
  /** Maximum number of documents */
  maxDocuments?: number;
  /** CSS class name */
  className?: string;
}

// ============================================================================
// Document Preview
// ============================================================================

function DocumentPreview({
  document,
  onRemove,
  disabled,
}: {
  document: UploadedDocument;
  onRemove: () => void;
  disabled?: boolean;
}) {
  const isPdf = document.mimeType === "application/pdf";
  const isImage = document.mimeType.startsWith("image/");

  return (
    <div className="group relative flex items-center gap-3 rounded-lg border bg-muted/30 p-3 overflow-hidden">
      {/* Thumbnail or Icon */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted">
        {isImage && document.thumbnailUrl ? (
          <img
            src={document.thumbnailUrl}
            alt={document.fileName}
            className="h-full w-full rounded-md object-cover"
          />
        ) : isPdf ? (
          <FileText className="h-6 w-6 text-red-500" />
        ) : (
          <ImageIcon className="h-6 w-6 text-blue-500" />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{document.fileName}</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(parseInt(document.fileSize))}
        </p>
      </div>

      {/* Remove button */}
      {!disabled && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      )}
    </div>
  );
}

// ============================================================================
// Helpers
// ============================================================================

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// ============================================================================
// Main Component
// ============================================================================

export function ClaimDocumentUploader({
  documents,
  onChange,
  disabled = false,
  maxDocuments = MAX_DOCUMENTS_PER_CLAIM,
  className,
}: ClaimDocumentUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canAddMore = documents.length < maxDocuments;

  // ========================================
  // File handling
  // ========================================

  const validateFile = useCallback((file: File): string | null => {
    if (!SUPPORTED_DOCUMENT_FORMATS.includes(file.type)) {
      return "Поддерживаются только PDF, JPEG и PNG";
    }
    if (file.size > MAX_DOCUMENT_SIZE) {
      return `Файл слишком большой (макс. ${MAX_DOCUMENT_SIZE / 1024 / 1024}MB)`;
    }
    return null;
  }, []);

  const uploadFile = useCallback(
    async (file: File, documentType: DocumentType) => {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        // Simulate progress (since fetch doesn't support progress)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 100);

        const response = await fetch("/api/upload/documents", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Ошибка загрузки");
        }

        const data = await response.json();

        const newDocument: UploadedDocument = {
          id: data.document.id,
          documentType,
          fileUrl: data.document.url,
          fileName: data.document.originalFilename,
          fileSize: String(data.document.size),
          mimeType: data.document.mimeType,
          thumbnailUrl: data.document.thumbnailUrl,
        };

        onChange([...documents, newDocument]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [documents, onChange]
  );

  const handleFileSelect = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      await uploadFile(file, "other");
    },
    [validateFile, uploadFile]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const newDocs = [...documents];
      newDocs.splice(index, 1);
      onChange(newDocs);
    },
    [documents, onChange]
  );

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
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled || !canAddMore) return;

      const file = e.dataTransfer.files[0];
      if (file) {
        await handleFileSelect(file);
      }
    },
    [disabled, canAddMore, handleFileSelect]
  );

  // ========================================
  // Render
  // ========================================

  return (
    <div className={cn("space-y-4", className)}>
      {/* Info Alert */}
      <Alert>
        <ShieldCheck className="h-4 w-4" />
        <AlertTitle>Зачем нужны документы?</AlertTitle>
        <AlertDescription className="space-y-2 text-sm">
          <p>
            Для подтверждения права собственности или проживания нам необходимы
            документы. Это защищает вас и других жильцов от мошенничества.
          </p>
          <p className="font-medium">Какие документы подойдут:</p>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            <li>Выписка из ЕГРН (подтверждает право собственности)</li>
            <li>Договор купли-продажи или дарения</li>
            <li>Договор аренды (для проживающих)</li>
            <li>Страница паспорта с пропиской</li>
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">
            <strong>Конфиденциальность:</strong> Документы используются только для
            проверки заявки и автоматически удаляются после её рассмотрения.
            Если у вас есть сомнения, вы можете показать документы лично
            администратору.
          </p>
        </AlertDescription>
      </Alert>

      {/* Drop Zone */}
      {canAddMore && !disabled && (
        <div
          className={cn(
            "relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50",
            isUploading && "pointer-events-none opacity-50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileSelect(file);
                e.target.value = "";
              }
            }}
            disabled={disabled || isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="w-48">
                <Progress value={uploadProgress} />
              </div>
              <p className="text-sm text-muted-foreground">Загрузка...</p>
            </div>
          ) : (
            <>
              <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-center text-sm text-muted-foreground">
                Перетащите файл или нажмите для выбора
              </p>
              <p className="mt-1 text-center text-xs text-muted-foreground">
                PDF, JPEG, PNG до 5MB
              </p>
            </>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Document List */}
      {documents.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Загруженные документы ({documents.length}/{maxDocuments})
            </label>
          </div>
          <div className="space-y-2">
            {documents.map((doc, index) => (
              <DocumentPreview
                key={doc.id}
                document={doc}
                onRemove={() => handleRemove(index)}
                disabled={disabled}
              />
            ))}
          </div>
        </div>
      )}

      {/* Limit reached message */}
      {!canAddMore && (
        <p className="text-center text-sm text-muted-foreground">
          Достигнут лимит документов ({maxDocuments})
        </p>
      )}
    </div>
  );
}
