import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../../handlers/CustomErrorHandler';
import jwt from 'jsonwebtoken';
import { env } from '../../configs/env';
import { authRepository } from './container';
import type { JwtPayload } from '../../types';

type AuthCookies = {
  token?: string;
};

export const authorize = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const cookies = req.cookies as AuthCookies;
    let token = cookies.token;

    if (token && token.startsWith('Bearer')) {
      token = token.split(' ')[1];
    }

    if (!token) {
      return next(new AppError(401, 'Unauthorized'));
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

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
