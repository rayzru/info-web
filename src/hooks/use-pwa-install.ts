"use client";

import { useCallback, useEffect } from "react";

import { type BeforeInstallPromptEvent, usePwaStore } from "~/stores/pwa-store";

declare global {
  interface Window {
    __pwaInstallPrompt?: BeforeInstallPromptEvent;
  }
}

// Early capture - runs when module loads (before React hydration)
if (typeof window !== "undefined" && !window.__pwaInstallPrompt) {
  window.addEventListener(
    "beforeinstallprompt",
    (e) => {
      e.preventDefault();
      window.__pwaInstallPrompt = e as BeforeInstallPromptEvent;
    },
    { once: true },
  );
}

export function usePwaInstall() {
  const {
    deferredPrompt,
    isInstallable,
    isDismissed,
    setDeferredPrompt,
    setIsInstallable,
    dismiss,
  } = usePwaStore();

  useEffect(() => {
    // Check if event was captured before mount
    if (window.__pwaInstallPrompt && !deferredPrompt) {
      setDeferredPrompt(window.__pwaInstallPrompt);
      setIsInstallable(true);
      delete window.__pwaInstallPrompt;
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const installedHandler = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, [deferredPrompt, isDismissed, isInstallable, setDeferredPrompt, setIsInstallable]);

  const install = useCallback(async () => {
    if (!deferredPrompt) return false;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setIsInstallable(false);

    return outcome === "accepted";
  }, [deferredPrompt, setDeferredPrompt, setIsInstallable]);

  return {
    isInstallable: isInstallable && !isDismissed,
    install,
    dismiss,
  };
}
