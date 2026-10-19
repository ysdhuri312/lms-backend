import z from 'zod';

export const studentSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(3),
  imageUrl: z.url(),
});

export type studentDto = z.infer<typeof studentSchema>;
