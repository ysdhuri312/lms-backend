import type { Request, Response, NextFunction } from 'express';
import type { CourseService } from './course.service';
import { AppError } from '../../handlers/CustomErrorHandler';
import { razopayVerifyPaymentSchema } from './course.schema';

export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  // Get all courses
  getAllcourse = async (_req: Request, res: Response, _next: NextFunction) => {
    const courses = await this.courseService.getAllCourses();

    res.status(200).json({
      success: true,
      message: 'fetching courses successfully',
      courses,
    });
  };

  // fetch single course using slug
  getCourse = async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    if (typeof slug !== 'string') {
      next(new AppError(400, 'Page not found'));
      return;
    }

    const course = await this.courseService.getCourse(slug);

    res.status(200).json({
      success: true,
      message: 'fetching course successfully',
      course,
    });
  };

  // course ordered.
  purchaseCourse = async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;
    const email = req.user?.email as string;

    if (typeof slug !== 'string') {
      next(new AppError(400, 'Page not found'));
      return;
    }

    const purchaseDetails = await this.courseService.purchaseCourse(
      email,
      slug,
    );

    res.status(201).json({
      success: true,
      message: 'Payment order created successfully',
      data: purchaseDetails,
    });
  };

  // Verify payment for ordered course.
  verifyPurchaseCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      razopayVerifyPaymentSchema.parse(req.body);

    if (
      typeof razorpay_order_id !== 'string' ||
      typeof razorpay_payment_id !== 'string' ||
      typeof razorpay_signature !== 'string'
    ) {
      return next(
        new AppError(400, 'Payment verification fields are required'),
      );
    }

    const userId = req.user?.id as number;

    const result = await this.courseService.verifyCoursePayment(userId, {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.status(201).json({
      success: true,
      message: 'Payment verified and course enrollment completed',
      data: result,
    });
  };
}
