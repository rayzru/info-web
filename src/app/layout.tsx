import { Suspense } from "react";

import { type Metadata } from "next";

import { PwaInstallPrompt } from "~/components/pwa-install-prompt";
import { SessionProvider } from "~/components/session-provider";
import { ThemeProvider } from "~/components/theme-provider";
import { ThemeTransitionOverlay } from "~/components/theme-transition";
import { Toaster } from "~/components/ui/sonner";
import { AnalyticsProvider } from "~/hooks/use-analytics";
import { TRPCReactProvider } from "~/trpc/react";

import "~/styles/globals.css";

const siteUrl = "https://sr2.ru";
const siteName = "Сердце Ростова 2";
const siteDescription =
  "Информационный портал жилого комплекса Сердце Ростова 2. Новости, события, объявления и полезная информация для жителей.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: ["Сердце Ростова 2", "ЖК", "Ростов-на-Дону", "жилой комплекс", "новости", "события"],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/sr2-block-banner.png`,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: [`${siteUrl}/sr2-block-banner.png`],
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "ru-RU": siteUrl,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "СР2",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "content-language": "ru",
    "geo.region": "RU-ROS",
    "geo.placename": "Ростов-на-Дону",
    "geo.position": "47.222078;39.720358",
    ICBM: "47.222078, 39.720358",
  },
};

// Schema.org JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description: siteDescription,
      inLanguage: "ru-RU",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/sr2-full-logo.svg`,
      },
    },
    {
      "@type": "Place",
      "@id": `${siteUrl}/#place`,
      name: "ЖК Сердце Ростова 2",
      description: "Жилой комплекс в Ростове-на-Дону",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ростов-на-Дону",
        addressRegion: "Ростовская область",
        addressCountry: "RU",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 47.222078,
        longitude: 39.720358,
      },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
            <PwaInstallPrompt />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
