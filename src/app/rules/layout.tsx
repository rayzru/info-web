import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

export const metadata: Metadata = {
  title: 'Правила сообщества',
  description: 'Сердце Ростова 2',
};

export default function Layout({ children }: PropsWithChildren) {
  return children;
}
