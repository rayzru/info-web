import React from 'react';
import { notFound } from 'next/navigation';

import { getCurrentUser } from '@/lib/session';

interface Props extends React.PropsWithChildren { }

export default async function MyLayout({ children }: Props) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  return (
    <div>
      { children }
    </div>
  );
}
