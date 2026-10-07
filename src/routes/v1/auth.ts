import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import { authController } from '../../modules/auth/container';
import { authorize } from '../../modules/auth/auth.middleware';

const authRouter = express.Router();

authRouter.get('/register', (req: Request, res: Response, next: NextFunction) =>
  authController.register(req, res, next),
);

authRouter.get('/login', (req: Request, res: Response, next: NextFunction) =>
  authController.login(req, res, next),
);

authRouter.get(
  '/me',
  authorize,
  (req: Request, res: Response, next: NextFunction) =>
    authController.me(req, res, next),
);

authRouter.get('/logout', (req: Request, res: Response, next: NextFunction) =>
  authController.logout(req, res, next),
);

export default authRouter;
