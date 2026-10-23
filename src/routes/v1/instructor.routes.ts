import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import { instructorController } from '../../modules/instructor/container';
import { authorize } from '../../modules/auth/auth.middleware';

const instructorRouter = express.Router();

instructorRouter.get(
  '/update-role',
  authorize,
  (req: Request, res: Response, next: NextFunction) =>
    instructorController.updateRoleToInstructor(req, res, next),
);

export default instructorRouter;
