import React from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Script from 'next/script'

import './globals.scss';

export const metadata: Metadata = {
  title: 'Сердце Ростова 2 - Справочная',
  description: 'Информационный центр',
};

interface RootProps {
  children: React.ReactNode;
}

const counterId = 'G-3XKTQETQNQ';


export default function RootLayout({ children }: RootProps) {
  return (
    <html lang="ru">
      <head>
        <title>Справочник ЖК "Сердце Ростова 2"</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <Script
          id="load-ga"
          strategy="lazyOnload"
          src={ `https://www.googletagmanager.com/gtag/js?id=${counterId}` }
        />

        <Script id="setup-ga" strategy="lazyOnload">
          { `
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag('js', new Date());
          gtag('config', '${counterId}', {
            page_path: window.location.pathname,
          });
        `}
        </Script>

      </head>
      <body>
        { children }
      </body>
    </html>
  );
}
