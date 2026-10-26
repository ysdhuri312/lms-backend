import type { Request, Response, NextFunction } from 'express';
import type { InstructorService } from './instructor.service';
import { courseSchema } from './instructor.schema';

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

  // Add course
  addCourse = async (req: Request, res: Response, _next: NextFunction) => {
    const dto = courseSchema.parse(req.body);
    const userId = req.user?.id as number;
    // const thumbnailImagePath = String(req.file?.path); TODO: Update after frontend design
    // const response = await uploadCoudinary(thumbnailImagePath); TODO: Update after frontend design

    const course = await this.instuctorService.addCourse(dto, userId);

    res.status(200).json({
      success: true,
      message: 'Add course successfully',
      course,
    });
  };
}
