import { z } from 'zod';

export const resendVerificationSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

export type ResendVerificationFormData = z.infer<
  typeof resendVerificationSchema
>;
