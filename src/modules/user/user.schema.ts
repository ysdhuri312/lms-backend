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

export const ratingSchema = z.object({
  courseId: z.string(),
  rating: z.number().min(1).max(5),
});

export const courseIdSchema = z.object({
  courseId: z.string(),
  lectureId: z.string(),
});

export type registerDto = z.infer<typeof registerSchema>;
export type loginDto = z.infer<typeof loginSchema>;
export type ratingDto = z.infer<typeof ratingSchema>;
