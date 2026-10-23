import type { Request, Response, NextFunction } from 'express';
import type { InstructorService } from './instructor.service';

export class InstructorController {
  constructor(private readonly instuctorService: InstructorService) {}

  // update role to educator
  updateRoleToInstructor = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const userId = req.user?.id as number;

    const user = await this.instuctorService.updateRoleToInstructor(userId);

    res.status(200).json({
      success: true,
      message: 'User role update successfully',
      user,
    });
  };
}
