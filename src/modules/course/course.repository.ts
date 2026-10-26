import { and, eq } from 'drizzle-orm';
import { db } from '../../configs/db';
import { courseTable, purchaseTable } from '../../db/schema';
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
      const [course] = await db
        .select()
        .from(courseTable)
        .where(eq(courseTable.slug, slug));
      return course;
    } catch (err) {
      throw new AppError(500, 'Error while fetching course using slug', err);
    }
  };

  purchaseCourse = async (purchaseData: {
    courseId: string;
    userId: number;
    amount: number;
  }) => {
    try {
      const [orderedDetails] = await db
        .insert(purchaseTable)
        .values(purchaseData)
        .returning();
      return orderedDetails;
    } catch (err) {
      throw new AppError(
        500,
        'Error while create purchase course details',
        err,
      );
    }
  };

  updatePurchaseCourse = async (razorpayId: string, orderedId: number) => {
    try {
      const [updatedOrderedDetails] = await db
        .update(purchaseTable)
        .set({ razorpayOrderId: razorpayId })
        .where(eq(purchaseTable.id, orderedId))
        .returning();
      return updatedOrderedDetails;
    } catch (err) {
      throw new AppError(
        500,
        'Error while update purchase course details',
        err,
      );
    }
  };

  existingPurchase = async (userId: number, courseId: string) => {
    try {
      const [course] = await db
        .select({})
        .from(purchaseTable)
        .where(
          and(
            eq(purchaseTable.userId, userId),
            eq(purchaseTable.courseId, courseId),
            eq(purchaseTable.status, 'completed'),
          ),
        )
        .limit(1);
      return course;
    } catch (err) {
      throw new AppError(
        500,
        'Error while find existing purchase course details',
        err,
      );
    }
  };

  getOrderedCourseByOrderedId = async (
    userId: number,
    razorpayOrderId: string,
  ) => {
    try {
      const [orderedDetails] = await db
        .select()
        .from(purchaseTable)
        .where(
          and(
            eq(purchaseTable.userId, userId),
            eq(purchaseTable.razorpayOrderId, razorpayOrderId),
          ),
        );
      return orderedDetails;
    } catch (err) {
      throw new AppError(
        500,
        'Error while fetch purchase course details using orderd id',
        err,
      );
    }
  };

  updatePaymentStatus = async (razorpay_payment_id: string, id: number) => {
    try {
      return await db.transaction(async (tx) => {
        await tx
          .update(purchaseTable)
          .set({
            status: 'completed',
            razorpayPaymentId: razorpay_payment_id,
          })
          .where(eq(purchaseTable.id, id));
      });
    } catch (err) {
      throw new AppError(500, 'Error while upadte purchase course status', err);
    }
  };

  getAllCoursesById = async (userId: number) => {
    try {
      return await db
        .select()
        .from(courseTable)
        .where(eq(courseTable.creatorId, userId));
    } catch (err) {
      throw new AppError(500, 'Error while fetching courses by userId', err);
    }
  };
}
