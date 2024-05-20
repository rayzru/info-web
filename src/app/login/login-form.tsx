'use client';

import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Google } from '@mui/icons-material';
import { Box, Button, FormControl, FormHelperText, IconButton, TextField } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

import VkIcon from '@/components/icons/VkIcon';
import YandexIcon from '@/components/icons/YandexIcon';
import { LoginUserInput, loginUserSchema } from '@/schemaForms';

import s from './login-form.module.scss';

export const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/my';

  const methods = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmitHandler: SubmitHandler<LoginUserInput> = async (values) => {
    try {
      setSubmitting(true);

      const res = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
        redirectTo: callbackUrl,
      });

      setSubmitting(false);

      if (!res?.error) {
        router.push(callbackUrl);
      } else {
        reset({ password: '' });
        const message = 'Неверный логин или пароль';
        setError(message);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <form
      onSubmit={ handleSubmit(onSubmitHandler) }
      className={ s.form }
    >
      <h1>Войти</h1>
      { error && (
        <FormHelperText error={ true }>
          <p>{ error }</p>
        </FormHelperText>
      ) }
      <FormControl>
        <TextField
          { ...register('email') }
          type='email'
          placeholder='Email'
          variant="outlined"
        />
        { errors['email'] && (
          <FormHelperText error={ true }>
            { errors['email']?.message as string }
          </FormHelperText>
        ) }
      </FormControl>

      <FormControl variant='outlined'>
        <TextField
          { ...register('password') }
          type='password'
          placeholder='Пароль'
          variant="outlined"
        />
        { errors['password'] && (
          <FormHelperText error={ true }>
            { errors['password']?.message as string }
          </FormHelperText>
        ) }
      </FormControl>
      <Box sx={ { display: 'flex', justifyContent: 'space-between' } }>
        <Button type='submit' disabled={ submitting } color='primary' variant='contained'>
          { submitting ? '...' : 'Войти' }
        </Button>
      </Box>
      <div className={ s.socialGroup }>
        <h2>Войти при помощи </h2>
        <IconButton onClick={ () => signIn('google', { callbackUrl }) }>
          <Google />
        </IconButton>
        <IconButton onClick={ () => signIn('yandex', { callbackUrl }) }>
          <YandexIcon />
        </IconButton>
        <IconButton onClick={ () => signIn('vk', { callbackUrl }) }>
          <VkIcon />
        </IconButton>
      </div>
    </form>
  );
};
