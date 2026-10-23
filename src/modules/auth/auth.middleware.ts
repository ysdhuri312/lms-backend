import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../../handlers/CustomErrorHandler';
import { authRepository } from './container';
import { verifyToken } from '../../utils/token';

export const authorize = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies.token as string;

    // Send token on cookies then not neccessary add bearer prefix.
    if (!token) {
      return next(new AppError(401, 'Unauthorized'));
    }

    const decoded = verifyToken(token);

    const user = await authRepository.findByEmail(decoded.email);

    if (!user) {
      return next(new AppError(401, 'Unauthorized'));
    }

    req.user = user;

    return next();
  } catch (err) {
    return next(new AppError(401, 'Unauthorized', err));
  }
};
