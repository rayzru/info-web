import React, { PropsWithChildren } from 'react';
import { Container } from '@mui/material';
import type { Metadata } from 'next';
import Script from 'next/script'
import { SessionProvider } from 'next-auth/react';

import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import ThemeRegistry from '@/themeRegistry';

import '@fontsource/roboto/400.css';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Справочная, информационный центр',
  description: 'Сердце Ростова 2',
};

export interface RootProps extends PropsWithChildren { }

const counterId = 'G-3XKTQETQNQ';

export default function RootLayout({ children }: RootProps) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="robots" content="noindex" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/logos/root.svg" />
        <link rel="icon" href="/logos/root.svg" sizes="any" />
      </head>
      <body>
        <Script id="load-ga" strategy="lazyOnload" src={ `https://www.googletagmanager.com/gtag/js?id=${counterId}` } />
        <Script id="setup-ga" strategy="lazyOnload">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${counterId}', { page_path: window.location.pathname });
        `}
        </Script>
        <ThemeRegistry options={ { key: 'mui' } }>
          <SessionProvider>
            <Navigation />
            <Container maxWidth="lg">
              { children }
            </Container>
            <Footer />
          </SessionProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
