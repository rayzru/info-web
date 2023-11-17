
import React, { PropsWithChildren } from 'react';
import { Tooltip } from '@mui/material';

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

interface Props extends PropsWithChildren {
  path: string;
  onClick?: () => void;
}

export const WrappedIcon: React.FC<Props> = ({ children, path, onClick }) => {
  const [, copy] = useCopyToClipboard();
  const handleClick = () => {
    copy(path);
    onClick && onClick();
  };
  return (
    <Tooltip title={ 'Скопировать' }>
      <div onClick={ handleClick } style={ { cursor: 'pointer' } }>
        { children }
      </div>
    </Tooltip>
  );
};
