import React, { useState } from 'react';
import { Box, Button, Modal, SxProps, TextField, Theme } from '@mui/material';

export const modalStyles: SxProps<Theme> = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 600,
  minWidth: 375,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  rowGap: 2
};
interface Props {
  open: boolean;
  closeHandler: () => void;
}

export function ThanxModal(props: Props) {
  const [message, setMessage] = useState('');

  const handleSend = () => fetch(
    '/api/thankyou',
    { method: 'POST', body: JSON.stringify({ message }) }
  ).then(() => props.closeHandler?.());

  return (
    <Modal open={ props.open } onClose={ props.closeHandler } disableEnforceFocus >
      <Box sx={ modalStyles } >
        <p>Ваши благодарности, просьбы, предложения или критику можно выразить абсолютно анонимно.
          Сообщение моментально будет отправлено в личные сообщения через Телеграмм.</p>
        <TextField variant='filled' label="Сообщение" multiline rows={ 4 } onChange={ (e) => setMessage(e.target.value) } />
        <Button onClick={ handleSend } disabled={ message.length === 0 } variant='contained'>Отправить</Button>
        <Button onClick={ props.closeHandler } variant='outlined'>Закрыть</Button>
      </Box>
    </Modal>
  );
}
