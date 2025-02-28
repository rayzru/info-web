import "@sr2/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@sr2/trpc/react";
import { ThemeProvider } from "@sr2/components/theme-provider";
import { Navigation } from "@sr2/components/navigation";

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
      <body className={GeistSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <div data-wrapper="" className="border-grid flex flex-1 flex-col min-w-[378px]">
              <main className="flex flex-1 flex-col pb-8">
                <Navigation />
                {children}
              </main>
            </div>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
