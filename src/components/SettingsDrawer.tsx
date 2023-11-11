import { FormEvent, useMemo } from 'react';
import { ChevronRight } from '@mui/icons-material';
import { Button, Checkbox, Divider, Drawer, FormControlLabel, FormGroup, IconButton, Paper } from '@mui/material';

import data from '@/data';
import { GroupInfo } from '@/types';

interface Props {
  isOpened: boolean;
  value: string;
  onClose: () => void;
  onUpdate: (value: string) => void;
}

export default function SettingsDrawer({ isOpened, value, onClose, onUpdate }: Readonly<Props>) {
  const checkState = useMemo(() => value.split(',') || [], [value]);

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={ isOpened }
    >
      <div>
        <IconButton onClick={ onClose }>
          <ChevronRight />
        </IconButton>
      </div>
      <Divider sx={ { marginTop: 2, marginBottom: 1 } } />
      <Paper sx={ { paddingLeft: 3, paddingRight: 3 } }>
        <form onSubmit={ handleSubmit }>
          <FormGroup>
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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    const values = data.filter(el => !Object.keys(formData).includes(el.id)).map(el => el.id).join(',');
    onUpdate(values);
    onClose();
  }
}

