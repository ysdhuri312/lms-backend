import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { courseController } from '../../modules/course/container';

const courseRouter = express.Router();

courseRouter.get('/all', (req: Request, res: Response, next: NextFunction) =>
  courseController.getAllcourse(req, res, next),
);

courseRouter.get('/:slug', (req: Request, res: Response, next: NextFunction) =>
  courseController.getCourse(req, res, next),
);

export default courseRouter;
