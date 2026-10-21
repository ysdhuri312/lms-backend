import Razorpay from 'razorpay';
import { env } from '../configs/env';

export const instance = new Razorpay({
  key_id: env.PAYMENT_KEY_ID,
  key_secret: env.PAYMENT_KEY_SECRET,
});
