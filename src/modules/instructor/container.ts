import { InstructorController } from './instructor.controller';
import { InstructorRepository } from './instructor.repository';
import { InstructorService } from './instructor.service';

export const instructorRepsoitory = new InstructorRepository();
export const instructorService = new InstructorService(instructorRepsoitory);
export const instructorController = new InstructorController(instructorService);
