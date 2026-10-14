import type { CourseRepository } from './course.repository';

export class CourseService {
  constructor(private readonly courseRepository: CourseRepository) {}

  getAllCourses = () => {
    return this.courseRepository.getAllCourses();
  };
}
