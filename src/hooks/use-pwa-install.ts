"use client";

import { useEffect, useCallback } from "react";

import {
  usePwaStore,
  type BeforeInstallPromptEvent,
} from "~/stores/pwa-store";

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
  }, [setDeferredPrompt, setIsInstallable]);

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
