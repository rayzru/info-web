import { Card, CardContent, Typography } from '@mui/material';

export const SupportCard = () => {
  return (
    <Card style={ { gridRow: 'span 1' } }>
      <CardContent>
        <Typography fontSize={ 12 } align='center' fontStyle={ 'italic' }>
          Не хватает информации или нашли ошибку<br />пишите в <a target='_blank' href='https://t.me/rayzru' >Telegram</a>
        </Typography>
      </CardContent>
    </Card>
  );
};
