import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('role', ['admin', 'user', 'instructor']);
export const paymentStatusEnum = pgEnum('status', [
  'pending',
  'completed',
  'failed',
]);

// User Schema
export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  imageUrl: varchar('image_url', { length: 255 }).default('NULL'),
  role: userRoleEnum().default('user').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Course Schema
export const courseTable = pgTable('courses', {
  courseId: varchar('course_id', { length: 255 }).unique().notNull(),
  title: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  description: varchar({ length: 255 }).notNull(),
  creatorId: integer('creator_id')
    .notNull()
    .references(() => usersTable.id),
  thumbnailUrl: varchar('thumbnail_url', { length: 255 }),
  price: integer().notNull(),
  isPublished: boolean('is_published').notNull().default(false),
  discount: integer(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const chapterTable = pgTable('chapters', {
  chapterId: varchar('chapter_id', { length: 255 }).unique().notNull(),
  chapterOrder: integer('chapter_order').notNull(),
  chapterTitle: varchar('chapter_title', { length: 255 }).notNull(),
  courseId: varchar('course_id')
    .references(() => courseTable.courseId)
    .notNull(),
});

export const lectureTable = pgTable('lectures', {
  lectureId: varchar('lecture_id', { length: 255 }).unique().notNull(),
  lectureTitle: varchar('lecture_title', { length: 255 }).notNull(),
  lectureDuration: integer('lecture_duration').notNull(),
  lectureUrl: varchar('lecture_url', { length: 255 }).notNull(),
  isPreviewFree: boolean('is_preview_free').notNull(),
  lectureOrder: integer('lecture_order').notNull(),
  chapterId: varchar('chapter_id', { length: 255 })
    .references(() => chapterTable.chapterId)
    .notNull(),
  courseId: varchar('course_id', { length: 255 })
    .references(() => courseTable.courseId)
    .notNull(),
});

// Purchase Schema
export const purchaseTable = pgTable('purchases', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  courseId: varchar('course_id', { length: 255 })
    .notNull()
    .references(() => courseTable.courseId),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id),
  razorpayOrderId: varchar('razorpay_order_id', {
    length: 100,
  }).unique(),
  razorpayPaymentId: varchar('razorpay_payment_id', {
    length: 100,
  }).unique(),
  amount: numeric({ mode: 'number' }).notNull(),
  status: paymentStatusEnum().default('pending').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
