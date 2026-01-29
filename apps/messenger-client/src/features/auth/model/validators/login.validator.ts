import { z } from 'zod';

export const loginSchema = z.object({
  login: z
    .string()
    .min(3, { message: 'Email or Username must be at least 3 characters' }),

  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
