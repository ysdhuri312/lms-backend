import type { Request, Response, NextFunction } from 'express';
import type { StudentService } from './student.service';
import { studentSchema } from './student.schema';

export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // Fetching student profile data.
  getStudentData = async (req: Request, res: Response, _next: NextFunction) => {
    const email = req.user?.email as string;

    const student = await this.studentService.getStudentData(email);

    res.status(200).json({
      success: true,
      message: 'Student data fetch successfully',
      student,
    });
  };

  // update student profile details
  updateStudentData = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const updatedStudentDetails = studentSchema.parse(req.body);
    const email = req.user?.email as string;

    const student = await this.studentService.updateStudentData(
      updatedStudentDetails,
      email,
    );

    res.status(200).json({
      success: true,
      message: 'Student data upadated successfully',
      student,
    });
  };
}
