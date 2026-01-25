import { z } from 'zod';

export const loginSchema = z.object({
  login: z
    .string()
    .min(3, { message: 'Email or Username must be at least 3 characters' }),

  password: z.string().min(1, { message: 'Password is required' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
