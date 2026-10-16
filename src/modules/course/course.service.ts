import { AppError } from '../../handlers/CustomErrorHandler';
import type { CourseRepository } from './course.repository';

export class CourseService {
  constructor(private readonly courseRepository: CourseRepository) {}

  getAllCourses = async () => {
    const allCourses = await this.courseRepository.getAllCourses();

    if (!allCourses) throw new AppError(404, 'Courses not found');

    return allCourses;
  };

  getCourse = async (slug: string) => {
    const course = await this.courseRepository.getCourse(slug);

    if (!course) throw new AppError(404, 'Course not found');

    return course;
  };
}
