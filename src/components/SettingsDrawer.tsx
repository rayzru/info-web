import { useEffect, useMemo, useRef } from 'react';
import { CloseRounded } from '@mui/icons-material';
import {
  Box, Checkbox, Divider, Drawer,
  FormControlLabel, FormGroup, IconButton, Typography
} from '@mui/material';

import data from '@/data';
import { GroupInfo } from '@/types';

interface Props {
  isOpened: boolean;
  value: string;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onUpdate: (value: string) => void;
}

export default function SettingsDrawer({ isOpened, value, onClose, onUpdate }: Props) {
  const checkState = useMemo(() => value.split(',') || [], [value]);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const escapeHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (isOpened) {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', escapeHandler);
    return () => {
      document.removeEventListener('keydown', escapeHandler);
    };
  }, [isOpened, onClose]);

  function handleSubmit() {
    const formData = Object.fromEntries(new FormData(formRef.current as HTMLFormElement));
    const values = data.filter(el => !Object.keys(formData).includes(el.id)).map(el => el.id).join(',');
    onUpdate(values);
  }

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={ isOpened }
      PaperProps={ {
        sx: { width: 350, minHeight: '100vh' },
      } }
    >
      <Box sx={ { padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' } }>
        <Typography>
          Настройки
        </Typography>
        <IconButton onClick={ onClose }>
          <CloseRounded />
        </IconButton>
      </Box>
      <Divider sx={ { marginBottom: 1 } } />
      <Box sx={ { paddingLeft: 3, paddingRight: 3, } }>
        <Typography color="text.secondary" variant="body2">
          Вы можете выбрать только требуемые карточки
        </Typography>
        <form ref={ formRef } >
          <FormGroup style={ { display: 'flex', flexFlow: 'row wrap' } }>
            { data.map((v: GroupInfo) => (
              <FormControlLabel
                style={ { flex: v.id.startsWith('liter') ? '0 1 138px' : '1 0 250px', width: 'max-content' } }
                key={ v.id }
                control={ <Checkbox name={ v.id } defaultChecked={ !checkState.includes(v.id) } onChange={ handleSubmit } /> }
                label={ v.title }
              />
            )) }
          </FormGroup>
        </form>
      </Box>
    </Drawer>
  );
}
