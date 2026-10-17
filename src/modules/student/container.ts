import { StudentController } from './student.controller';
import { StudentRepository } from './student.repository';
import { StudentService } from './student.service';

export const studentRepository = new StudentRepository();
export const studentService = new StudentService(studentRepository);
export const studentController = new StudentController(studentService);
