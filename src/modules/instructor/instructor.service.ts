import { AppError } from '../../handlers/CustomErrorHandler';
import type { InstructorRepository } from './instructor.repository';
import type { courseDto } from './instructor.schema';

export class InstructorService {
  constructor(private readonly instructorRepository: InstructorRepository) {}

  // update role to educator
  updateRoleToInstructor = async (userId: number) => {
    const user = await this.instructorRepository.updateRoleToInstructor(userId);

    if (!user) throw new AppError(401, 'Unauthorize');

    return user;
  };

  // Add Course
  addCourse = async (dto: courseDto, userId: number) => {
    const { chapters } = dto;

    if (!Array.isArray(chapters) || chapters.length === 0) {
      throw new AppError(400, 'At least one chapter is required');
    }

    const course = await this.instructorRepository.addCourse(dto, userId);

    return course;
  };
}
