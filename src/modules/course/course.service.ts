import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils';
import { env } from '../../configs/env';
import { AppError } from '../../handlers/CustomErrorHandler';
import { instance } from '../../utils/payments';
import type { AuthRepository } from '../auth/auth.repository';
import type { CourseRepository } from './course.repository';

type VerifyPaymentInput = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export class CourseService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly userRepository: AuthRepository,
  ) {}

  getAllCourses = async () => {
    const allCourses = await this.courseRepository.getAllCourses();

    if (!allCourses) throw new AppError(404, 'Courses not found');

    return allCourses;
  };

  getCourse = async (slug: string) => {
    const course = await this.courseRepository.getCourse(slug);

    if (!course) throw new AppError(404, 'Course not found');

    return course;
  };

  purchaseCourse = async (email: string, slug: string) => {
    const user = await this.userRepository.findByEmail(email);
    const course = await this.courseRepository.getCourse(slug);

    console.log(email);

    if (!user || !course) throw new AppError(404, 'Data not found');

    const courseAlreadyPurchased = await this.courseRepository.existingPurchase(
      user.id,
      course.id,
    );

    console.log(courseAlreadyPurchased);

    if (courseAlreadyPurchased) {
      throw new AppError(409, 'You have already enrolled in this course');
    }

    const courseAmount: number = Number(
      !course.discount
        ? course.price
        : (course.price - course.price * (course.discount / 100)).toFixed(2),
    );

    const purchaseData: {
      courseId: number;
      userId: number;
      amount: number;
    } = {
      courseId: course.id,
      userId: user.id,
      amount: courseAmount,
    };

    // Create order in database
    const orderedDetails =
      await this.courseRepository.purchaseCourse(purchaseData);

    if (!orderedDetails) throw new AppError(500, 'Order failed');

    try {
      // create rozarpay order
      const razorpayOrderDetails = await instance.orders.create({
        amount: courseAmount * 100, // in paise
        currency: 'INR',
        receipt: `receipt_${orderedDetails.id}`,
      });

      // save rozarpay orderId in db
      const updatedOrderedDetails =
        await this.courseRepository.updatePurchaseCourse(
          razorpayOrderDetails.id,
          orderedDetails.id,
        );

      return {
        paymentOrderId: updatedOrderedDetails?.id,
        keyId: env.PAYMENT_KEY_ID,
        orderId: updatedOrderedDetails?.razorpayOrderId,
        amount: updatedOrderedDetails?.amount,
      };
    } catch (err) {
      throw new AppError(500, 'Ordered failed', err);
    }
  };

  // Verify payment
  verifyCoursePayment = async (
    userId: number,
    input: VerifyPaymentInput,
  ): Promise<void> => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      input;

    // find ordered using razorpay_order_id
    const orderedDetails =
      await this.courseRepository.getOrderedCourseByOrderedId(
        userId,
        razorpay_order_id,
      );

    if (!orderedDetails) {
      throw new AppError(400, 'Payment order not found');
    }

    if (orderedDetails.razorpayOrderId !== razorpay_order_id) {
      throw new AppError(400, 'Order ID does not match');
    }

    if (orderedDetails.status === 'completed') {
      throw new AppError(400, 'Payment already verified');
    }

    if (!orderedDetails.razorpayOrderId) {
      throw new AppError(400, 'Razorpay order ID missing');
    }

    // Generate the expected signature from the trusted order ID.
    const secret = env.PAYMENT_KEY_SECRET;
    const body = `${orderedDetails.razorpayOrderId}|${razorpay_payment_id}`;

    const isValidSignature = validateWebhookSignature(
      body,
      razorpay_signature,
      secret,
    );

    if (!isValidSignature) throw new AppError(400, 'Invalid payment signature');

    // Verify the actual payment against Razorpay's API.
    const payment = await instance.payments.fetch(razorpay_payment_id);

    if (
      payment.order_id !== orderedDetails.razorpayOrderId ||
      payment.amount !== Number(orderedDetails.amount) * 100
    ) {
      throw new AppError(400, 'Payment details do not match the order');
    }

    if (payment.status !== 'captured') {
      throw new AppError(400, 'Payment is not captured yet', payment.status);
    }

    // Update the payment and enroll the user atomically.
    await this.courseRepository.updatePaymentStatus(
      razorpay_payment_id,
      orderedDetails.id,
    );
  };
}
