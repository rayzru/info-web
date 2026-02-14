"use client";

import { useCallback } from "react";

export function useThemeTransition() {
  return useCallback(async (applyTheme: () => void, origin?: { x: number; y: number }) => {
    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
      // Fallback: just apply theme without animation
      applyTheme();
      return;
    }

    // Set the origin for the circular clip-path animation
    const x = origin ? origin.x : window.innerWidth - 50;
    const y = origin ? origin.y : window.innerHeight - 50;

    document.documentElement.style.setProperty("--theme-transition-x", `${x}px`);
    document.documentElement.style.setProperty("--theme-transition-y", `${y}px`);

    // Start view transition
    const transition = document.startViewTransition(() => {
      applyTheme();
    });

    await transition.finished;
  }, []);
}

// This component is no longer needed since we use View Transitions API
export function ThemeTransitionOverlay() {
  return null;
}
