/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs';
import { env } from '../configs/env';
import { AppError } from '../handlers/CustomErrorHandler';

let isConfigured = false;

export const connectCloudinary = () => {
  if (isConfigured) return;

  try {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_SECRET_KEY,
      secure: true,
    });

    isConfigured = true;
    console.log('✅ Cloudinary configured', cloudinary.config().cloud_name);
  } catch (err) {
    throw new AppError(500, '❌ Connection failed to cloudinary', err);
  }
};

export const uploadCoudinary = async (localFilePath: string | undefined) => {
  if (!localFilePath) throw new AppError(400, 'Local file path not found');

  try {
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder: 'lmsv2',
    });

    // file has been uploaded successfull
    console.log('file is uploaded on cloudinary');

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Cloudinary upload failed:', {
      message: err.message,
      http_code: err.http_code,
      name: err.name,
      details: err.error,
    });
    throw new AppError(
      500,
      'Getting error while upload file no cloudinary',
      err,
    );
  } finally {
    // Remove the temporary file whether upload succeeds or fails.
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (cleanupError) {
      console.error('Failed to delete temporary file:', cleanupError);
    }
  }
};
