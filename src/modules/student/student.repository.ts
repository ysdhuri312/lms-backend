import { eq } from 'drizzle-orm';
import { db } from '../../configs/db';
import { usersTable } from '../../db/schema';
import { AppError } from '../../handlers/CustomErrorHandler';

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
}
