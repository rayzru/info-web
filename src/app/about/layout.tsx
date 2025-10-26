import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

export const metadata: Metadata = {
  title: 'Сообщество соседей',
  description: 'Сердце Ростова 2',
};

export default function Layout({ children }: PropsWithChildren) {
  return children;
}
