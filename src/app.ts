import express, { type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './handlers/globalErrorHandler.js';
import authRouter from './routes/v1/auth.js';
import courseRouter from './routes/v1/course.js';
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
    message: 'Welcome to API v2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Router
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/course', courseRouter);

app.use(globalErrorHandler);
