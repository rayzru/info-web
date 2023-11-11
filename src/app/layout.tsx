import React, { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script'

import ThemeRegistry from '@/themeRegistry';

import '@fontsource/roboto/400.css';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Сердце Ростова 2 - Справочная',
  description: 'Информационный центр',
};

export interface RootProps extends PropsWithChildren { }

const counterId = 'G-3XKTQETQNQ';

export default function RootLayout({ children }: RootProps) {
  return (
    <html lang="ru">
      <head>
        <title>Справочник ЖК Сердце Ростова 2</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
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
        <ThemeRegistry options={ { key: 'mui' } }>{ children }</ThemeRegistry>
      </body>
    </html>
  );
}
