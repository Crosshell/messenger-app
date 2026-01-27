import { z } from 'zod';

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(6, { message: 'Username must be at least 6 characters long' })
      .regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/, {
        message: 'Username can only contain letters, numbers and dashes',
      }),

    email: z.string().email({ message: 'Invalid email address' }),

    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
