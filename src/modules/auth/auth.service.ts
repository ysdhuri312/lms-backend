import bcrypt from 'bcryptjs';
import { AppError } from '../../handlers/CustomErrorHandler';
import type { AuthRepository } from './auth.repository';
import type { loginDto, registerDto } from './auth.schema';
import { email } from 'zod';

export class AuthService {
  constructor(private readonly authReposiory: AuthRepository) {}

  register = async (dto: registerDto) => {
    // if user already exists
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

  login = async (dto: loginDto) => {
    // find user in db
    const user = await this.authReposiory.findByEmail(dto.email);

    if (!user) {
      throw new AppError(401, 'User not register');
    }

    const userAuthenticated = await bcrypt.compare(dto.password, user.password);

    if (!userAuthenticated) {
      throw new AppError(401, 'Invalid credential');
    }

    return user.email;
  };
}
