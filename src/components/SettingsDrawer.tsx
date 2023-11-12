import { FormEvent, useMemo } from 'react';
import { CloseRounded } from '@mui/icons-material';
import { Box, Button, Checkbox, Divider, Drawer, FormControlLabel, FormGroup, IconButton, Paper, Typography } from '@mui/material';

import data from '@/data';
import { GroupInfo } from '@/types';

interface Props {
  isOpened: boolean;
  value: string;
  onClose: () => void;
  onUpdate: (value: string) => void;
}

export default function SettingsDrawer({ isOpened, value, onClose, onUpdate }: Props) {
  const checkState = useMemo(() => value.split(',') || [], [value]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    const values = data.filter(el => !Object.keys(formData).includes(el.id)).map(el => el.id).join(',');
    onUpdate(values);
    onClose();
  }

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={ isOpened }
      PaperProps={ {
        sx: { width: 350 },
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
      <Paper sx={ { paddingLeft: 3, paddingRight: 3 } }>
        <Typography color="text.secondary" variant="body2">
          Вы можете выводить только требуемые вам карточки
        </Typography>
        <form onSubmit={ handleSubmit }>
          <FormGroup title='asd'>
            { data.map((v: GroupInfo) => (
              <FormControlLabel
                key={ v.id }
                control={ <Checkbox name={ v.id } defaultChecked={ !checkState.includes(v.id) } /> }
                label={ v.title }
              />
            )) }
          </FormGroup>
          <Button sx={ { marginTop: 3, marginBottom: 2 } } type='submit' color='primary' variant='contained' fullWidth>Сохранить</Button>
        </form>
      </Paper>
    </Drawer>
  );
}
