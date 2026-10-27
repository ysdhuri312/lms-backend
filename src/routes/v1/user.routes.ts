import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import { userController } from '../../modules/user/container';
import { authorize } from '../../modules/user/user.middleware';

const userRouter = express.Router();

userRouter.post(
  '/register',
  (req: Request, res: Response, next: NextFunction) =>
    userController.register(req, res, next),
);

userRouter.post('/login', (req: Request, res: Response, next: NextFunction) =>
  userController.login(req, res, next),
);

userRouter.get(
  '/add-rating',
  authorize,
  (req: Request, res: Response, next: NextFunction) =>
    userController.addUserRating(req, res, next),
);

userRouter.get(
  '/get-course-progress',
  authorize,
  (req: Request, res: Response, next: NextFunction) =>
    userController.getUserCourseProgress(req, res, next),
);

userRouter.get(
  '/me',
  authorize,
  (req: Request, res: Response, next: NextFunction) =>
    userController.me(req, res, next),
);

userRouter.get('/logout', (req: Request, res: Response, next: NextFunction) =>
  userController.logout(req, res, next),
);

export default userRouter;
