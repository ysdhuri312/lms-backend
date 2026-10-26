import { eq } from 'drizzle-orm';
import { db } from '../../configs/db';
import {
  chapterTable,
  courseTable,
  lectureTable,
  usersTable,
} from '../../db/schema';
import { AppError } from '../../handlers/CustomErrorHandler';
import type { courseDto } from './instructor.schema';
import { randomUUID } from 'node:crypto';

export class InstructorRepository {
  // update role to educator
  updateRoleToInstructor = async (userId: number) => {
    try {
      const [user] = await db
        .update(usersTable)
        .set({ role: 'instructor' })
        .where(eq(usersTable.id, userId))
        .returning({
          id: usersTable.id,
          email: usersTable.email,
          role: usersTable.role,
        });
      return user;
    } catch (err) {
      throw new AppError(500, 'Error while updating role', err);
    }
  };

  // add course
  addCourse = async (dto: courseDto, userId: number) => {
    const {
      title,
      slug,
      description,
      thumbnailUrl,
      price,
      discount,
      isPublished,
      chapters,
    } = dto;

    try {
      const course = await db.transaction(async (tx) => {
        const courseId = randomUUID();

        // create course
        await tx.insert(courseTable).values({
          courseId,
          title,
          slug,
          description,
          creatorId: userId,
          thumbnailUrl,
          price,
          discount,
          isPublished: isPublished ?? false,
        });

        const createdChapters = [];

        // create chapters
        for (const chapter of chapters) {
          const chapterId = randomUUID();
          const { chapterOrder, chapterTitle } = chapter;

          await tx.insert(chapterTable).values({
            chapterId,
            chapterOrder,
            chapterTitle,
            courseId,
          });

          const createdLecture = [];

          // create lecture for each chapter
          for (const lecture of chapter.lectures ?? []) {
            const lectureId = randomUUID();
            const {
              lectureTitle,
              lectureDuration,
              lectureUrl,
              lectureOrder,
              isPreviewFree,
            } = lecture;

            await tx.insert(lectureTable).values({
              lectureId,
              lectureTitle,
              lectureOrder,
              lectureDuration,
              lectureUrl,
              isPreviewFree,
              chapterId,
              courseId,
            });

            createdLecture.push({ lectureId, ...lecture });
          }

          createdChapters.push({
            chapterId,
            chapterOrder,
            chapterTitle,
            lectures: createdLecture,
          });
        }

        return {
          courseId,
          title,
          slug,
          description,
          thumbnailUrl,
          price,
          discount,
          isPublished: isPublished ?? false,
          chapters: createdChapters,
        };
      });
      return course;
    } catch (err) {
      throw new AppError(500, 'Error while adding new courese', err);
    }
  };
}
