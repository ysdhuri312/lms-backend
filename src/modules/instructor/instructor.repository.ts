import { eq } from 'drizzle-orm';
import { db } from '../../configs/db';
import { usersTable } from '../../db/schema';
import { AppError } from '../../handlers/CustomErrorHandler';

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
}
