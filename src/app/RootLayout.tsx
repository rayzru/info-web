import React from 'react';

import { RootProps } from './layout';

export default function RootLayout({ children }: RootProps) {
  return (
    <html lang="ru">
      <head>
        <title>Справочник ЖК "Сердце Ростова 2"</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        {/* <Script
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
            </Script> */}
        { children }
      </body>
    </html>
  );
}
