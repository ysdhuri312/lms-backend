import { AppError } from '../../handlers/CustomErrorHandler';
import type { StudentRepository } from './student.repository';

export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  getStudentData = async (email: string) => {
    const [student] = await this.studentRepository.getStudentData(email);

    if (!student) throw new AppError(401, 'Unauthorize');

    return student;
  };
}
