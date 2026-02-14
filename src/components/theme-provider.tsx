"use client";

import * as React from "react";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import { useThemeStore } from "~/stores/theme-store";

export function ThemeProvider({
  children,
  ...props
}: Readonly<React.ComponentProps<typeof NextThemesProvider>>) {
  const [mounted, setMounted] = React.useState(false);
  const { theme } = useThemeStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider {...props} forcedTheme={undefined} defaultTheme={theme}>
      {children}
    </NextThemesProvider>
  );
}
