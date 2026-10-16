import { eq } from 'drizzle-orm';
import { db } from '../../configs/db';
import { courseTable } from '../../db/schema';
import { AppError } from '../../handlers/CustomErrorHandler';

export class CourseRepository {
  getAllCourses = async () => {
    try {
      return await db.select().from(courseTable);
    } catch (err) {
      throw new AppError(500, 'Error while fetching courses', err);
    }
  };

  getCourse = async (slug: string) => {
    try {
      return await db
        .select()
        .from(courseTable)
        .where(eq(courseTable.slug, slug));
    } catch (err) {
      throw new AppError(500, 'Error while fetching course using slug', err);
    }
  };
}
