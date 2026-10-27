import bcrypt from 'bcryptjs';
import { AppError } from '../../handlers/CustomErrorHandler';
import type { UserRepository } from './user.repository';
import type { loginDto, registerDto } from './user.schema';
import type { JwtPayload } from '../../types';
import { createToken } from '../../utils/token';

export class UserService {
  constructor(private readonly userReposiory: UserRepository) {}

  register = async (dto: registerDto) => {
    // if user already exists
    const existingUser = await this.userReposiory.findByEmail(dto.email);

    if (existingUser) {
      throw new AppError(
        401,
        'User already register, Please logged in or forgot password',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userReposiory.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    const payload: JwtPayload = {
      id: user!.id,
      email: user!.email,
    };

    const token = createToken(payload);

    return { user, token };
  };

  login = async (dto: loginDto) => {
    // find user in db
    const user = await this.userReposiory.findByEmail(dto.email);

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

    const token = createToken(payload);

    return { user: { id: user.id, email: user.email }, token };
  };

  addUserRating = async (userId: number, courseId: string, rating: number) => {
    const isCourseEnrolled = await this.userReposiory.courseEnrolled(
      userId,
      courseId,
    );
    // Check user course enrolled or not
    if (!isCourseEnrolled)
      throw new AppError(400, 'User not enrolled selected course');

    const isUserAlreadyRated = await this.userReposiory.userAlreadyRated(
      userId,
      courseId,
    );

    // Check is user already rated
    if (isUserAlreadyRated) {
      // Update the existing rating
      await this.userReposiory.updateRating(isUserAlreadyRated.id, rating);
      return true;
    }

    // Add rating
    await this.userReposiory.addRating(userId, courseId, rating);

    return true;
  };
}
