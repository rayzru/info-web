import { z } from "zod";

// Password requirements schema
export const passwordSchema = z.string().min(8, "Пароль должен быть не менее 8 символов");

// Registration form schema (with password confirmation and anti-bot fields)
export const registerFormSchema = z
  .object({
    name: z.string().min(1, "Введите имя").min(2, "Имя должно быть не менее 2 символов"),
    email: z.string().min(1, "Введите email").email("Некорректный формат email"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Подтвердите пароль"),
    // Anti-bot fields
    website: z.string().optional(), // Honeypot field
    timeToken: z.string().optional(), // Time-based token
    fingerprint: z.string().optional(), // Browser fingerprint
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerFormSchema>;

// Registration input schema (for tRPC, with anti-bot fields)
export const registerInputSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: passwordSchema,
  name: z.string().min(2, "Имя должно быть не менее 2 символов"),
  // Anti-bot fields
  website: z.string().optional(), // Honeypot field (must be empty)
  timeToken: z.string().optional(), // Time-based token
  fingerprint: z.string().optional(), // Browser fingerprint
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

// Login form schema
export const loginFormSchema = z.object({
  email: z.string().min(1, "Введите email").email("Некорректный формат email"),
  password: z.string().min(1, "Введите пароль"),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

// Forgot password form schema
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Введите email").email("Некорректный формат email"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Reset password form schema
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Подтвердите пароль"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
