import { z } from "zod";

// Password requirements schema
export const passwordSchema = z
  .string()
  .min(8, "Пароль должен быть не менее 8 символов");

// Registration form schema (with password confirmation)
export const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Введите имя")
      .min(2, "Имя должно быть не менее 2 символов"),
    email: z
      .string()
      .min(1, "Введите email")
      .email("Некорректный формат email"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Подтвердите пароль"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerFormSchema>;

// Registration input schema (for tRPC, without confirmPassword)
export const registerInputSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: passwordSchema,
  name: z.string().min(2, "Имя должно быть не менее 2 символов"),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;
