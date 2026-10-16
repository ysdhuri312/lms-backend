import type { Request, Response, NextFunction } from 'express';
import type { CourseService } from './course.service';
import { AppError } from '../../handlers/CustomErrorHandler';

export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  // Get all courses
  getAllcourse = async (_req: Request, res: Response, _next: NextFunction) => {
    const courses = await this.courseService.getAllCourses();

    res.status(200).json({
      success: true,
      message: 'fetching courses successfully',
      courses,
    });
  };

  // fetch single course using slug
  getCourse = async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    if (typeof slug !== 'string') {
      next(new AppError(400, 'Page not found'));
      return;
    }

    const course = await this.courseService.getCourse(slug);

    res.status(200).json({
      success: true,
      message: 'fetching course successfully',
      course,
    });
  };
}
