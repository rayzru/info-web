import React from 'react';
import type { Metadata } from 'next';

import './globals.css';


export const metadata: Metadata = {
  title: 'Сердце Ростова 2 - Сообщество',
  description: 'Информационный центр',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <title>Справочник ЖК "Сердце Ростова 2"</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={ '' }>{ children }</body>
    </html>
  );
}
