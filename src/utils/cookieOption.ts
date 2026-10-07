import { env } from '../configs/env';

type CookieObject = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  maxAge?: number;
};

export const cookieOptions: CookieObject = {
  httpOnly: true,
  secure: env.NODE_ENV === 'development' ? false : true,
  sameSite: env.NODE_ENV === 'development' ? 'lax' : 'strict',
  maxAge: 24 * 60 * 60 * 1000,
};
