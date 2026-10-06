import type { Request, Response, NextFunction } from 'express';
import { authService } from './container';
import {
  loginSchema,
  registerSchema,
  type loginDto,
  type registerDto,
} from './auth.schema';

export class AuthController {
  register = async (req: Request, res: Response, _next: NextFunction) => {
    const dto: registerDto = registerSchema.parse(req.body);

    const user = await authService.register(dto);

    console.log(user);

    res.status(200).json({
      success: true,
      message: 'User register successfully',
      user,
    });
  };
  login = async (req: Request, res: Response, _next: NextFunction) => {
    const dto: loginDto = loginSchema.parse(req.body);

    const user = await authService.login(dto);
    res.status(200).json({
      success: true,
      message: 'User login successfully',
      user,
    });
  };
}
