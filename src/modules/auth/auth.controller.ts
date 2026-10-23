import type { Request, Response, NextFunction } from 'express';
import {
  loginSchema,
  registerSchema,
  type loginDto,
  type registerDto,
} from './auth.schema';
import { cookieOptions } from '../../utils/cookieOption';
import type { AuthService } from './auth.service';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response, _next: NextFunction) => {
    const dto: registerDto = registerSchema.parse(req.body);

    const { user, token } = await this.authService.register(dto);

    res.status(201).cookie('token', token, cookieOptions).json({
      success: true,
      message: 'User register successfully',
      user,
    });
  };
  login = async (req: Request, res: Response, _next: NextFunction) => {
    const dto: loginDto = loginSchema.parse(req.body);

    const { user, token } = await this.authService.login(dto);

    res.status(200).cookie('token', token, cookieOptions).json({
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
