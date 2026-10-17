import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { studentController } from '../../modules/student/container';
import { authorize } from '../../modules/auth/auth.middleware';

const studentRouter = express.Router();

studentRouter.get(
  '/profile',
  authorize,
  (req: Request, res: Response, next: NextFunction) =>
    studentController.getStudentData(req, res, next),
);

export default studentRouter;
