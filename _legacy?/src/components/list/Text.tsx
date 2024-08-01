'use client';

import { ArticleOutlined, CopyAll } from '@mui/icons-material';
import { Tooltip, Typography } from '@mui/material';

import { Action, BaseListItem } from '@/components/list/BaseListItem';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { IterableInfo, TextInfo } from '@/types';

interface Props extends TextInfo, IterableInfo {
  title?: string;
}


export const Text = ({ text, title, ...props }: Props) => {
  const [, copy] = useCopyToClipboard();

  const actions: Action[] = [{
    label: 'Скопировать',
    icon: <CopyAll />,
    callback: () => copy(text)
  }];

  return (

    <BaseListItem
      actions={ actions }
      icon={ <ArticleOutlined /> }
      { ...props }
    >
      { title }
      <Tooltip title={ <Typography fontSize={ 12 } sx={ { whiteSpace: 'pre-line' } }>{ text }</Typography> }>
        <Typography
          color={ 'text.secondary' }
          fontSize={ 12 }
          sx={ {
            whiteSpace: 'pre-line', overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical',
          } }
        >
          { text }
        </Typography>
      </Tooltip>
    </BaseListItem >
  );
};
