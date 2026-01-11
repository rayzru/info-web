import { type Metadata } from "next";
import { Suspense } from "react";

import { AnalyticsProvider } from "~/hooks/use-analytics";
import { SessionProvider } from "~/components/session-provider";
import { ThemeProvider } from "~/components/theme-provider";
import { ThemeTransitionOverlay } from "~/components/theme-transition";
import { Toaster } from "~/components/ui/sonner";
import { TRPCReactProvider } from "~/trpc/react";

import "~/styles/globals.css";

export const metadata: Metadata = {
  title: "Сердце Ростова 2",
  description: "Сообщество жильцов",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="robots" content="noindex" />
        <meta name="theme-color" content="#ffffff" />
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/png"
          sizes="32x32"
        />
      </head>
      <body>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCReactProvider>
              <Suspense fallback={null}>
                <AnalyticsProvider>{children}</AnalyticsProvider>
              </Suspense>
            </TRPCReactProvider>
            <Toaster />
            <ThemeTransitionOverlay />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
