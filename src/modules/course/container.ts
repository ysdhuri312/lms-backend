import { authRepository } from '../auth/container';
import { CourseController } from './course.controller';
import { CourseRepository } from './course.repository';
import { CourseService } from './course.service';

export const courseRepository = new CourseRepository();
export const courseService = new CourseService(
  courseRepository,
  authRepository,
);
export const courseController = new CourseController(courseService);
