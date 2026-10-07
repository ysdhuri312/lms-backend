import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../../handlers/CustomErrorHandler';
import type { AuthRepository } from './auth.repository';
import type { loginDto, registerDto } from './auth.schema';
import { env } from '../../configs/env';
import type { JwtPayload } from '../../types';

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

    const payload: JwtPayload = {
      id: user!.id,
      email: user!.email,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return { user, token };
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

    const payload: { id: number; email: string } = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return { user: { id: user.id, email: user.email }, token };
  };
}
