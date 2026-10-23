import { AppError } from '../../handlers/CustomErrorHandler';
import type { InstructorRepository } from './instructor.repository';

export class InstructorService {
  constructor(private readonly instructorRepository: InstructorRepository) {}

  // update role to educator
  updateRoleToInstructor = async (userId: number) => {
    const user = await this.instructorRepository.updateRoleToInstructor(userId);

    if (!user) throw new AppError(401, 'Unauthorize');

    return user;
  };
}
