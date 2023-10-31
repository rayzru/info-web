'use client';

import { Action, Base } from '@/components/Base';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { WebsiteInfo } from '@/types';

import styles from './WebLink.module.scss';

interface Props extends WebsiteInfo {
  title?: string;
}

export const WebLink = ({ url, title, ...props }: Props) => {
  const [, copy] = useCopyToClipboard();

  const actions: Action[] = [
    {
      icon: 'copy',
      label: 'Скопировать',
      callback: () => {
        copy(url);
      }
    },
  ];

  return (
    <Base actions={ actions } { ...props } >
      { url && (
        <>
          <a target='_blank' className={ styles.link } href={ url }>{ title ?? url }</a>
        </>
      ) }
    </Base>
  );
};
