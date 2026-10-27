import type { Request, Response, NextFunction } from 'express';
import {
  courseIdSchema,
  loginSchema,
  ratingSchema,
  registerSchema,
  type loginDto,
  type registerDto,
} from './user.schema';
import { cookieOptions } from '../../utils/cookieOption';
import type { UserService } from './user.service';

export class UserController {
  constructor(private readonly userService: UserService) {}

  register = async (req: Request, res: Response, _next: NextFunction) => {
    const dto: registerDto = registerSchema.parse(req.body);

    const { user, token } = await this.userService.register(dto);

    res.status(201).cookie('token', token, cookieOptions).json({
      success: true,
      message: 'User register successfully',
      user,
    });
  };

  login = async (req: Request, res: Response, _next: NextFunction) => {
    const dto: loginDto = loginSchema.parse(req.body);

    const { user, token } = await this.userService.login(dto);

    res.status(200).cookie('token', token, cookieOptions).json({
      success: true,
      message: 'User login successfully',
      user,
    });
  };

  addUserRating = async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user?.id as number;
    const { courseId, rating } = ratingSchema.parse(req.body);

    await this.userService.addUserRating(userId, courseId, rating);

    res.status(200).json({
      success: true,
      message: 'Add rating succefully',
    });
  };

  getUserCourseProgress = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const userId = req.user?.id as number;
    const { courseId } = courseIdSchema.parse(req.body);

    const progress = await this.userService.getUserCourseProgress(
      userId,
      courseId,
    );

    res.status(200).json({
      success: true,
      message: 'Fetching progress details succefully',
      progress,
    });
  };

  // TODO: Changes want below controller in future
  updateUserCourseProgress = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const userId = req.user?.id as number;
    const { courseId, lectureId } = courseIdSchema.parse(req.body);

    const progress = await this.userService.updateuUserCourseProgress(
      userId,
      courseId,
      lectureId,
    );

    res.status(200).json({
      success: true,
      message: 'Update course progress successfully',
      progress,
    });
  };

  me = (_req: Request, res: Response, _next: NextFunction) => {
    res.json({
      success: true,
      message: 'User authorize',
      timestamp: new Date().toISOString(),
    });
  };

  logout = (_req: Request, res: Response, _next: NextFunction) => {
    res.status(200).cookie('token', '').json({
      success: true,
      message: 'User logout successfully',
    });
  };
}
