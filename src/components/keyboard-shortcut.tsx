"use client";

import { useState, useEffect } from "react";
import { Command } from "lucide-react";
import { cn } from "~/lib/utils";

type KeyboardShortcutProps = {
  shortcutKey?: string;
  className?: string;
  showOnMobile?: boolean;
};

/**
 * OS-aware keyboard shortcut display component.
 * Shows ⌘K on Mac, ^K on Windows/Linux.
 * Must be lazy-loaded as it requires client-side OS detection.
 */
export function KeyboardShortcut({
  shortcutKey = "K",
  className,
  showOnMobile = false,
}: KeyboardShortcutProps) {
  const [isMac, setIsMac] = useState<boolean | null>(null);

  useEffect(() => {
    // Detect Mac vs Windows/Linux
    const platform = navigator.platform?.toLowerCase() ?? "";
    const userAgent = navigator.userAgent?.toLowerCase() ?? "";
    const isMacOS =
      platform.includes("mac") ||
      userAgent.includes("macintosh") ||
      userAgent.includes("mac os");
    setIsMac(isMacOS);
  }, []);

  // Don't render until we know the OS (prevents hydration mismatch)
  if (isMac === null) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 text-xs text-muted-foreground",
        !showOnMobile && "hidden sm:flex",
        className
      )}
    >
      <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono flex items-center">
        {isMac ? (
          <Command className="h-3 w-3" />
        ) : (
          <span className="text-xs">^</span>
        )}
      </kbd>
      <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
        {shortcutKey}
      </kbd>
    </div>
  );
}

/**
 * Inline keyboard shortcut for use in buttons/inputs.
 * More compact styling for embedding in other components.
 */
export function KeyboardShortcutInline({
  shortcutKey = "K",
  className,
}: {
  shortcutKey?: string;
  className?: string;
}) {
  const [isMac, setIsMac] = useState<boolean | null>(null);

  useEffect(() => {
    const platform = navigator.platform?.toLowerCase() ?? "";
    const userAgent = navigator.userAgent?.toLowerCase() ?? "";
    const isMacOS =
      platform.includes("mac") ||
      userAgent.includes("macintosh") ||
      userAgent.includes("mac os");
    setIsMac(isMacOS);
  }, []);

  if (isMac === null) {
    return null;
  }

  return (
    <kbd
      className={cn(
        "bg-muted pointer-events-none h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none flex",
        className
      )}
    >
      <span className="text-xs">{isMac ? "⌘" : "^"}</span>
      {shortcutKey}
    </kbd>
  );
}
