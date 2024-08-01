'use client';

import { PlaylistAdd } from '@mui/icons-material';
import { Card, CardContent, styled } from '@mui/material';
import { useRouter } from 'next/navigation';

const StyledCard = styled(Card)`
  border: 1px dashed lightgray;
  transition: all 0.3s;
  cursor: pointer;
  &:hover {
    border-style: solid;
    border-color: lightblue;
  }
`;

export const ParkingCardNew = () => {
  const router = useRouter();
  return (
    <StyledCard
      variant='outlined'
      sx={ {
        backgroundColor: 'transparent',
        minHeight: '100%',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      } }
      onClick={ () => router.push('/parking/request') }
    >
      <CardContent sx={ { display: 'flex', flexFlow: 'column', rowGap: 4, alignItems: 'center' } }>
        <PlaylistAdd />
        Добавить объявление
      </CardContent>
    </StyledCard>
  );
};
