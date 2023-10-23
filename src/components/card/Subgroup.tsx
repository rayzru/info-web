import { PropsWithChildren } from 'react';

import { PropsWithStyles } from '@/types';

interface Props extends PropsWithChildren, PropsWithStyles {
}

export const Subgroup = ({ children, className }: Props) => {
  return (
    <section className={ className }>
      { children }
    </section>
  );
};