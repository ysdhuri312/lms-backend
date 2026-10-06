import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';

export const authRepository = new AuthRepository();
export const authService = new AuthService(authRepository);
export const authController = new AuthController();
