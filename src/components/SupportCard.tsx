import { Card, Typography } from '@mui/material';

export const SupportCard = () => {
  return (
    <Card style={ { gridRow: 'span 1', backgroundColor: 'transparent', padding: 12 } } variant='outlined'>
      <Typography fontSize={ 12 } align='center'>
          Не хватает информации или нашли ошибку<br />пишите в <a target='_blank' href='https://t.me/rayzru' >Telegram</a>
      </Typography>
    </Card>
  );
};
