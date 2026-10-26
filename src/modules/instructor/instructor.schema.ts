import { z } from 'zod';

const lectureSchema = z.object({
  lectureTitle: z.string(),
  lectureDuration: z.number().int().nonnegative(),
  lectureUrl: z.url(),
  isPreviewFree: z.boolean(),
  lectureOrder: z.number().int().positive(),
});

const chapterSchema = z.object({
  chapterOrder: z.number().int().positive(),
  chapterTitle: z.string(),
  lectures: z.array(lectureSchema),
});

export const courseSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  thumbnailUrl: z.url(),
  price: z.number().nonnegative(),
  discount: z.number().min(0).max(100),
  isPublished: z.boolean(),
  chapters: z.array(chapterSchema),
});

// Infer TypeScript types from the schema
export type courseDto = z.infer<typeof courseSchema>;
export type chapterDto = z.infer<typeof chapterSchema>;
export type lectureDto = z.infer<typeof lectureSchema>;
