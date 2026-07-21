import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { globalErrorHandler } from './handlers/GlobalErrorHandler.js';
import { AppError } from './handlers/CustomErrorHandler.js';
import cookieParser from 'cookie-parser';

export const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

export function sum(a: number, b: number) {
  const sum = a + b;
  return sum;
}

app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome to API v1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/error', () => {
  throw new AppError(404, 'Not found');
});

app.use(globalErrorHandler);
