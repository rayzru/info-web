"use client";

import Image from "next/image";
import { Download, X } from "lucide-react";

import { Button } from "~/components/ui/button";
import { usePwaInstall } from "~/hooks/use-pwa-install";
import { cn } from "~/lib/utils";

export function PwaInstallPrompt() {
  const { isInstallable, install, dismiss } = usePwaInstall();

  if (!isInstallable) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 animate-in fade-in-0"
        onClick={dismiss}
      />

      {/* Prompt */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 rounded-t-xl border-t bg-background p-4 shadow-lg",
          "animate-in slide-in-from-bottom duration-300",
        )}
      >
        <div className="mx-auto flex max-w-lg items-center gap-4">
          <Image
            src="/icons/icon-192x192.png"
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">Установить СР2</p>
            <p className="text-sm text-muted-foreground truncate">
              Быстрый доступ с главного экрана
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" onClick={install}>
              <Download className="mr-2 h-4 w-4" />
              Установить
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={dismiss}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Закрыть</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
