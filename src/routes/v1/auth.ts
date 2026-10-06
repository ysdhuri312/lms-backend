import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import { authController } from '../../modules/auth/container';

const router = express.Router();

router.get('/register', (req: Request, res: Response, next: NextFunction) =>
  authController.register(req, res, next),
);

router.get('/login', (req: Request, res: Response, next: NextFunction) =>
  authController.login(req, res, next),
);

export default router;
