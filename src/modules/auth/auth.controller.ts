import type { Request, Response, NextFunction } from 'express';
import { authService } from './container';
import {
  loginSchema,
  registerSchema,
  type loginDto,
  type registerDto,
} from './auth.schema';
import { cookieOptions } from '../../utils/cookieOption';

export class AuthController {
  register = async (req: Request, res: Response, _next: NextFunction) => {
    const dto: registerDto = registerSchema.parse(req.body);

    const { user, token } = await authService.register(dto);

    res.status(200).cookie('token', `Bearer ${token}`, cookieOptions).json({
      success: true,
      message: 'User register successfully',
      user,
    });
  };
  login = async (req: Request, res: Response, _next: NextFunction) => {
    const dto: loginDto = loginSchema.parse(req.body);

    const { user, token } = await authService.login(dto);

    res.status(200).cookie('token', `Bearer ${token}`, cookieOptions).json({
      success: true,
      message: 'User login successfully',
      user,
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
