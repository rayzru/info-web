"use client";

import { useState } from "react";

import { FolderOpen, Upload, X } from "lucide-react";

import { ImageUploader } from "~/components/media";
import { MediaLibrary } from "~/components/media/media-library";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { Media } from "~/server/db/schema";

interface EditorImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageSelect: (url: string, alt?: string) => void;
}

export function EditorImageDialog({ open, onOpenChange, onImageSelect }: EditorImageDialogProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "library">("upload");
  const [libraryOpen, setLibraryOpen] = useState(false);

  const handleUploadComplete = (url: string | null, media?: Media) => {
    if (url) {
      onImageSelect(url, media?.alt ?? media?.originalFilename);
      onOpenChange(false);
    }
  };

  const handleLibrarySelect = (media: Media) => {
    onImageSelect(media.url, media.alt ?? media.originalFilename);
    setLibraryOpen(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Вставить изображение</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "upload" | "library")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Загрузить
              </TabsTrigger>
              <TabsTrigger value="library" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Библиотека
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-4">
              <ImageUploader
                value={null}
                onChange={handleUploadComplete}
                enableCrop={false}
                addWatermark={false}
                placeholder="Перетащите изображение или нажмите для загрузки"
              />
            </TabsContent>

            <TabsContent value="library" className="mt-4">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FolderOpen className="text-muted-foreground mb-4 h-12 w-12" />
                <p className="text-muted-foreground mb-4 text-sm">
                  Выберите изображение из медиабиблиотеки
                </p>
                <Button onClick={() => setLibraryOpen(true)}>Открыть библиотеку</Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <MediaLibrary
        open={libraryOpen}
        onOpenChange={setLibraryOpen}
        onSelect={handleLibrarySelect}
      />
    </>
  );
}
