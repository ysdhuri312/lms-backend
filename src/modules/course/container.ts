import { userRepository } from '../user/container';
import { CourseController } from './course.controller';
import { CourseRepository } from './course.repository';
import { CourseService } from './course.service';

export const courseRepository = new CourseRepository();
export const courseService = new CourseService(
  courseRepository,
  userRepository,
);
export const courseController = new CourseController(courseService);
