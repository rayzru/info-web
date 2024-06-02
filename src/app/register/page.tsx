'use client';

import { Box } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { RegisterForm } from './register-form';

export default function Rules() {
  const { status } = useSession();
  const { push } = useRouter();
  if (status === 'loading') return null;
  if (status === 'authenticated') {
    push('/my');
  }
  return (
    <>
      <RegisterForm />
      <Box sx={ { mt: 3 } }>
        <Link href='/login'>
          Уже зарегистрированы?
        </Link>
      </Box>
    </>
  );
}
