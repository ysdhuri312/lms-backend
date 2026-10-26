import { userRepository } from '../user/container';
import { courseRepository } from '../course/container';
import { InstructorController } from './instructor.controller';
import { InstructorRepository } from './instructor.repository';
import { InstructorService } from './instructor.service';

export const instructorRepsoitory = new InstructorRepository();
export const instructorService = new InstructorService(
  instructorRepsoitory,
  userRepository,
  courseRepository,
);
export const instructorController = new InstructorController(instructorService);
