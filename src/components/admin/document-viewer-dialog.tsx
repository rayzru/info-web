"use client";

import { Download, X } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { DOCUMENT_TYPES } from "~/lib/upload/document-constants";

interface DocumentViewerDialogProps {
  document: {
    fileUrl: string;
    fileName: string;
    mimeType: string;
    documentType: string;
    fileSize?: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocumentViewerDialog({ document, open, onOpenChange }: DocumentViewerDialogProps) {
  if (!document) return null;

  const isPdf = document.mimeType === "application/pdf";
  const isImage = document.mimeType?.startsWith("image/");
  const documentTypeLabel =
    DOCUMENT_TYPES[document.documentType as keyof typeof DOCUMENT_TYPES] ?? document.documentType;

  // Format file size
  const formatFileSize = (bytes?: string) => {
    if (!bytes) return "";
    const numBytes = parseInt(bytes, 10);
    if (numBytes < 1024) return `${numBytes} B`;
    if (numBytes < 1024 * 1024) return `${(numBytes / 1024).toFixed(1)} KB`;
    return `${(numBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{document.fileName}</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{documentTypeLabel}</Badge>
              {document.fileSize && (
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(document.fileSize)}
                </span>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={document.fileUrl} download target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Скачать
              </a>
            </Button>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-[600px] w-full overflow-auto rounded-lg border bg-muted/30">
          {isPdf && (
            <iframe
              src={document.fileUrl}
              className="h-full w-full"
              title={document.fileName}
              style={{ border: "none" }}
            />
          )}
          {isImage && (
            <div className="flex h-full items-center justify-center p-4">
              <img
                src={document.fileUrl}
                alt={document.fileName}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}
          {!isPdf && !isImage && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p className="mb-2">Предпросмотр недоступен для этого типа файла</p>
                <Button variant="outline" size="sm" asChild>
                  <a href={document.fileUrl} download target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Скачать файл
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
