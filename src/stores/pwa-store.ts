import { create } from "zustand";
import { persist } from "zustand/middleware";

// BeforeInstallPromptEvent is not standard yet, define interface
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PwaState {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isInstallable: boolean;
  isDismissed: boolean;
  setDeferredPrompt: (prompt: BeforeInstallPromptEvent | null) => void;
  setIsInstallable: (value: boolean) => void;
  dismiss: () => void;
  reset: () => void;
}

export const usePwaStore = create<PwaState>()(
  persist(
    (set) => ({
      deferredPrompt: null,
      isInstallable: false,
      isDismissed: false,
      setDeferredPrompt: (prompt) => set({ deferredPrompt: prompt }),
      setIsInstallable: (value) => set({ isInstallable: value }),
      dismiss: () => set({ isDismissed: true }),
      reset: () => set({ isDismissed: false }),
    }),
    {
      name: "pwa-install",
      partialize: (state) => ({ isDismissed: state.isDismissed }),
    }
  )
);

// Export type for use in hooks
export type { BeforeInstallPromptEvent };
