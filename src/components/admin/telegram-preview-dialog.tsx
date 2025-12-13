"use client";

import { Loader2, Send, Image as ImageIcon, AlertCircle } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { api } from "~/trpc/react";

interface TelegramPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newsId: string;
  onSend: () => void;
  isSending: boolean;
}

export function TelegramPreviewDialog({
  open,
  onOpenChange,
  newsId,
  onSend,
  isSending,
}: TelegramPreviewDialogProps) {
  const { data: preview, isLoading, error } = api.news.telegramPreview.useQuery(
    { id: newsId },
    { enabled: open }
  );

  // Convert HTML to display-friendly format
  const formatPreviewText = (html: string): string => {
    return html
      .replace(/<b>/g, "**")
      .replace(/<\/b>/g, "**")
      .replace(/<i>/g, "_")
      .replace(/<\/i>/g, "_")
      .replace(/<u>/g, "")
      .replace(/<\/u>/g, "")
      .replace(/<s>/g, "~~")
      .replace(/<\/s>/g, "~~")
      .replace(/<code>/g, "`")
      .replace(/<\/code>/g, "`")
      .replace(/<a href="([^"]+)">([^<]+)<\/a>/g, "$2 ($1)")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&");
  };

  const charCount = preview?.text?.length ?? 0;
  const isOverLimit = charCount > 4096;
  const captionLimit = preview?.hasImage ? 1024 : 4096;
  const isOverCaptionLimit = charCount > captionLimit;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Превью сообщения в Telegram</DialogTitle>
          <DialogDescription>
            Проверьте как будет выглядеть сообщение перед отправкой в канал
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Ошибка загрузки превью: {error.message}
              </AlertDescription>
            </Alert>
          ) : preview ? (
            <>
              {/* Image indicator */}
              {preview.hasImage && preview.imageUrl && (
                <div className="relative rounded-lg overflow-hidden bg-muted">
                  <img
                    src={preview.imageUrl}
                    alt="Обложка"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" />
                    Фото
                  </div>
                </div>
              )}

              {/* Message preview */}
              <div className="rounded-lg border bg-[#1e2a38] p-4">
                <ScrollArea className="h-[300px]">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-white leading-relaxed">
                    {formatPreviewText(preview.text)}
                  </pre>
                </ScrollArea>
              </div>

              {/* Character count */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {preview.hasImage ? "Подпись к фото" : "Текстовое сообщение"}
                </span>
                <span
                  className={
                    isOverCaptionLimit
                      ? "text-destructive font-medium"
                      : "text-muted-foreground"
                  }
                >
                  {charCount} / {captionLimit} символов
                </span>
              </div>

              {/* Warnings */}
              {isOverCaptionLimit && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {preview.hasImage
                      ? "Подпись к фото ограничена 1024 символами. Текст будет обрезан."
                      : "Сообщение ограничено 4096 символами. Текст будет обрезан."}
                  </AlertDescription>
                </Alert>
              )}
            </>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            onClick={onSend}
            disabled={isSending || isLoading || !!error}
          >
            {isSending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Отправить в Telegram
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
