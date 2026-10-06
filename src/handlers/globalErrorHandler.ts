import type { Response, Request, NextFunction } from 'express';
import { env } from '../configs/env.js';
import { AppError } from './CustomErrorHandler.js';

export function globalErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      timestamp: new Date().toISOString(),
      details: env.NODE_ENV === 'development' ? err.stack : null,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    timestamp: new Date().toISOString(),
    details: env.NODE_ENV === 'development' ? err.stack : null,
  });
}
