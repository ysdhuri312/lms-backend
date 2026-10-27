import { and, eq } from 'drizzle-orm';
import { db } from '../../configs/db';
import {
  courseProgressTable,
  courseRatingsTable,
  purchaseTable,
  usersTable,
} from '../../db/schema';
import { AppError } from '../../handlers/CustomErrorHandler';
import type { registerDto } from './user.schema';

export class UserRepository {
  findByEmail = async (email: string) => {
    try {
      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));
      return user;
    } catch (err) {
      throw new AppError(500, 'Error while finding user by email', err);
    }
  };

  findById = async (userId: number) => {
    try {
      const [user] = await db
        .select({
          id: usersTable.id,
          email: usersTable.email,
          role: usersTable.role,
        })
        .from(usersTable)
        .where(eq(usersTable.id, userId));
      return user;
    } catch (err) {
      throw new AppError(500, 'Error while finding user by email', err);
    }
  };

  create = async (dto: registerDto) => {
    try {
      const [user] = await db
        .insert(usersTable)
        .values(dto)
        .returning({ id: usersTable.id, email: usersTable.email });
      return user;
    } catch (err) {
      throw new AppError(500, 'Error while creating user', err);
    }
  };

  courseEnrolled = async (userId: number, courseId: string) => {
    try {
      const [result] = await db
        .select()
        .from(purchaseTable)
        .where(
          and(
            eq(purchaseTable.purchaseStudentId, userId),
            eq(purchaseTable.courseId, courseId),
            eq(purchaseTable.status, 'completed'),
          ),
        );
      return result;
    } catch (err) {
      throw new AppError(
        500,
        'Error while check user course enrolled or not',
        err,
      );
    }
  };

  userAlreadyRated = async (userId: number, courseId: string) => {
    try {
      const [result] = await db
        .select()
        .from(courseRatingsTable)
        .where(
          and(
            eq(courseRatingsTable.userId, userId),
            eq(courseRatingsTable.courseId, courseId),
          ),
        );
      return result;
    } catch (err) {
      throw new AppError(
        500,
        'Error while check user course enrolled or not',
        err,
      );
    }
  };

  updateRating = async (courseRatingId: number, rating: number) => {
    try {
      return await db
        .update(courseRatingsTable)
        .set({ rating: rating })
        .where(eq(courseRatingsTable.id, courseRatingId));
    } catch (err) {
      throw new AppError(500, 'Error while update rating', err);
    }
  };

  addRating = async (userId: number, courseId: string, rating: number) => {
    try {
      return await db
        .insert(courseRatingsTable)
        .values({ userId, courseId, rating });
    } catch (err) {
      throw new AppError(500, 'Error while add rating', err);
    }
  };

  userCourseProgress = async (userId: number, courseId: string) => {
    try {
      const progress = await db
        .select()
        .from(courseProgressTable)
        .where(
          and(
            eq(courseProgressTable.userId, userId),
            eq(courseProgressTable.courseId, courseId),
          ),
        );
      return progress;
    } catch (err) {
      throw new AppError(500, 'Error while fetching course progress', err);
    }
  };
}
