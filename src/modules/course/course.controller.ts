import type { Request, Response, NextFunction } from 'express';
import type { CourseService } from './course.service';

export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  getAllcourse = async (_req: Request, res: Response, _next: NextFunction) => {
    const courses = await this.courseService.getAllCourses();

    res.status(200).json({
      success: true,
      message: 'fetching courses successfully',
      courses,
    });
  };
}
