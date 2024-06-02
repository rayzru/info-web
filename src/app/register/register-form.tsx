'use client';

import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Google } from '@mui/icons-material';
import { Box, Button, FormControl, FormHelperText, IconButton, TextField } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

import VkIcon from '@/components/icons/VkIcon';
import YandexIcon from '@/components/icons/YandexIcon';
import { CreateUserInput, createUserSchema } from '@/schemaForms';

import s from './register-form.module.scss';

export const RegisterForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get('callbackUrl') || '/my';
  const methods = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmitHandler: SubmitHandler<CreateUserInput> = async (values) => {
    try {
      setSubmitting(true);
      const res = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();

        if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          setError(errorData.errors.map((error: any) => error.message).join('\n'));
          return;
        }
        setError(errorData.message);
        return;
      }

      signIn(undefined, { callbackUrl: '/' });
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
      <h1>Регистрация</h1>
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
      <FormControl>
        <TextField
          { ...register('name') }
          type='text'
          placeholder='Имя'
          variant="outlined"
        />
        { errors['name'] && (
          <FormHelperText error={ true }>
            { errors['name']?.message as string }
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
      <FormControl variant='outlined'>
        <TextField
          { ...register('passwordConfirm') }
          type='password'
          placeholder='Подтвердите пароль'
          variant="outlined"
        />
        { errors['passwordConfirm'] && (
          <FormHelperText error={ true }>
            { errors['passwordConfirm']?.message as string }
          </FormHelperText>
        ) }
      </FormControl>
      <Box sx={ { display: 'flex', justifyContent: 'space-between' } }>
        <Button type='submit' disabled={ submitting } color='primary' variant='contained'>
          { submitting ? '...' : 'Зарегистрироваться' }
        </Button>
      </Box>
      <div className={ s.socialGroup }>
        <h2>Регистрация при помощи </h2>
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
