import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { courseController } from '../../modules/course/container';
import { authorize } from '../../modules/auth/auth.middleware';

const courseRouter = express.Router();

courseRouter.get('/all', (req: Request, res: Response, next: NextFunction) =>
  courseController.getAllcourse(req, res, next),
);

courseRouter.get('/:slug', (req: Request, res: Response, next: NextFunction) =>
  courseController.getCourse(req, res, next),
);

courseRouter.get(
  '/purchase/:slug/orders',
  authorize,
  (req: Request, res: Response, next: NextFunction) =>
    courseController.purchaseCourse(req, res, next),
);

courseRouter.post(
  '/purchase/:slug/verify',
  authorize,
  (req: Request, res: Response, next: NextFunction) =>
    courseController.verifyPurchaseCourse(req, res, next),
);

export default courseRouter;
