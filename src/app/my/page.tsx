import { Button } from '@mui/material';

import { signOut } from '@/auth';

export default async function My() {

  return (
    <>
      Персональный раздел

      <form
        action={ async () => {
          'use server';
          await signOut();
        } }
      >
        <Button type='submit'>Выйти</Button>
      </form>
    </>
  );
}
