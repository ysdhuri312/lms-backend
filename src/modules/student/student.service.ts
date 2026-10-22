import bcrypt from 'bcryptjs';
import { AppError } from '../../handlers/CustomErrorHandler';
import type { StudentRepository } from './student.repository';
import type { studentDto } from './student.schema';

export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  getStudentData = async (email: string) => {
    const [student] = await this.studentRepository.getStudentData(email);

    if (!student) throw new AppError(401, 'Unauthorize');

    return student;
  };

  updateStudentData = async (dto: studentDto, email: string) => {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const student = await this.studentRepository.updateStudentData(
      { ...dto, password: hashedPassword },
      email,
    );

    if (!student) throw new AppError(401, 'Unauthorize');

    return student;
  };

  getStudentEnrolledCourses = async (userId: number) => {
    return await this.studentRepository.getStudentEnrolledCourses(userId);
  };
}
