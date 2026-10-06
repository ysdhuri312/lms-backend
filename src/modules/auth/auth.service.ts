import bcrypt from 'bcryptjs';
import { AppError } from '../../handlers/CustomErrorHandler';
import type { AuthRepository } from './auth.repository';
import type { registerDto } from './auth.schema';

export class AuthService {
  constructor(private readonly authReposiory: AuthRepository) {}

  // if user already exists
  register = async (dto: registerDto) => {
    const existingUser = await this.authReposiory.findByEmail(dto.email);

    if (existingUser) {
      throw new AppError(
        401,
        'User already register, Please logged in or forgot password',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.authReposiory.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });
    return user;
  };
}
