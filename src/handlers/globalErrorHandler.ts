import type { Response, Request, NextFunction } from 'express';
import { env } from '../configs/env.js';
import type { AppError } from './CustomErrorHandler.js';

export function globalErrorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    timestamp: new Date().toISOString(),
    details: env.NODE_ENV === 'development' ? err.stack : null,
  });
}
