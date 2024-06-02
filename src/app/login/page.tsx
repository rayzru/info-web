
import { Suspense } from 'react';
import { Box } from '@mui/material';
import Link from 'next/link';

import { getCurrentUser } from '@/lib/session';

import { LoginForm } from './login-form';

export default async function Login() {
  const user = await getCurrentUser();

  if (user) {
    console.log(user);
    // return redirect('/my');
  }

  return (
    <>
      <Suspense fallback={ <>Грузим...</> }>
        <LoginForm />
      </Suspense>
      <Box sx={ { mt: 3 } }>
        <Link href='/register'>Еще не регистрировались?</Link>
      </Box>
    </>
  );
}
