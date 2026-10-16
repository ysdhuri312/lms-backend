import jwt from 'jsonwebtoken';
import type { JwtPayload } from '../types';
import { env } from '../configs/env';

export const createToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};
