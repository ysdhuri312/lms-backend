import z from 'zod';

export const registerSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(3),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(3),
});

export type registerDto = z.infer<typeof registerSchema>;
export type loginDto = z.infer<typeof loginSchema>;
