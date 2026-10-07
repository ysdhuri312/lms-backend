import { eq } from 'drizzle-orm';
import { db } from '../../configs/db';
import { usersTable } from '../../db/schema';
import { AppError } from '../../handlers/CustomErrorHandler';
import type { registerDto } from './auth.schema';

export class AuthRepository {
  findByEmail = async (email: string) => {
    try {
      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);
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
