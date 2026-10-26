import { eq } from 'drizzle-orm';
import { db } from '../../configs/db';
import { usersTable } from '../../db/schema';
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
}
