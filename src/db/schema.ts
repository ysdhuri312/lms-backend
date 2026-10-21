import {
  boolean,
  integer,
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

export const courseTable = pgTable('courses', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  description: varchar({ length: 255 }).notNull(),
  creatorId: integer('creator_id').notNull(),
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

export const purchaseTable = pgTable('purchases', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  courseId: integer('course_id').notNull(),
  userId: integer('user_id').notNull(),
  razorpayOrderId: varchar('razorpay_order_id', {
    length: 100,
  }).unique(),
  razorpayPaymentId: varchar('razorpay_payment_id', {
    length: 100,
  }).unique(),
  amount: integer().notNull(),
  status: paymentStatusEnum().default('pending').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
