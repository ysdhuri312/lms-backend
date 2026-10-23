import { v2 as cloudinary } from 'cloudinary';
import { env } from '../configs/env';
import { AppError } from '../handlers/CustomErrorHandler';

let isConfigured = false;

const connectCloudinary = () => {
  if (isConfigured) return;

  try {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_SECRET_KEY,
    });

    isConfigured = true;
    console.log('✅ Cloudinary configured');
  } catch (err) {
    throw new AppError(500, '❌ Connection failed to cloudinary', err);
  }
};

export default connectCloudinary;
