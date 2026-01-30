import { z } from 'zod';

export const editProfileSchema = z.object({
  username: z
    .string()
    .min(6, { message: 'Username must be at least 6 characters long' })
    .regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/, {
      message: 'Username can only contain letters, numbers and dashes',
    }),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
