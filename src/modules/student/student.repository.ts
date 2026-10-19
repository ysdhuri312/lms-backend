import { eq } from 'drizzle-orm';
import { db } from '../../configs/db';
import { usersTable } from '../../db/schema';
import { AppError } from '../../handlers/CustomErrorHandler';
import type { studentDto } from './student.schema';

export class StudentRepository {
  // Fetching student profile data.
  getStudentData = async (email: string) => {
    try {
      return await db
        .select({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          imageUrl: usersTable.imageUrl,
          role: usersTable.role,
          createdAt: usersTable.createdAt,
        })
        .from(usersTable)
        .where(eq(usersTable.email, email));
    } catch (err) {
      throw new AppError(500, 'Error while fetching student data', err);
    }
  };

  // update student profile data.
  updateStudentData = async (dto: studentDto, email: string) => {
    try {
      return await db
        .update(usersTable)
        .set({
          name: dto.name,
          email: dto.email,
          password: dto.password,
          imageUrl: dto.imageUrl,
        })
        .where(eq(usersTable.email, email))
        .returning({ id: usersTable.id, email: usersTable.email });
    } catch (err) {
      throw new AppError(500, 'Error while update student data', err);
    }
  };
}
