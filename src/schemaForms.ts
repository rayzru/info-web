import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
  name: string({ required_error: 'Имя обязательно' })
    .min(1, 'Имя обязательно'),
  email: string({ required_error: 'Email обязателен' })
    .min(1, 'Email обязателен')
    .email('Неверный формат электронного почтового адреса'),
  photo: string().optional(),
  password: string({ required_error: 'Пароль обязателен' })
    .min(1, 'Пароль обязателен')
    .min(6, 'Пароль должен быть больше 6 символов.')
    .max(32, 'Пароль не должен превышать 32 символа.'),
  passwordConfirm: string({ required_error: 'Пожалуйста, подтвердите ваш пароль' })
    .min(1, 'Пожалуйста, подтвердите ваш пароль'),
})
  .refine(
    (data) => data.password === data.passwordConfirm,
    { path: ['passwordConfirm'], message: 'Пароли не совпадают' }
);

export const loginUserSchema = object({
  email: string({ required_error: 'Email обязателен' })
    .min(1, 'Email обязателен')
    .email('Неверный логин или пароль'),
  password: string({ required_error: 'Пароль обязателен' })
    .min(1, 'Пароль обязателен'),
});

export type LoginUserInput = TypeOf<typeof loginUserSchema>;
export type CreateUserInput = TypeOf<typeof createUserSchema>;
