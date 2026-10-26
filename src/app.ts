import express, { type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './handlers/globalErrorHandler.js';
import userRouter from './routes/v1/user.routes.js';
import courseRouter from './routes/v1/course.routes.js';
import studentRouter from './routes/v1/student.routes.js';
import path from 'node:path';
import instructorRouter from './routes/v1/instructor.routes.js';
export const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:4000',
    credentials: true,
  }),
);
app.use(cookieParser());

// app.use((req, _res, next) => {
//   console.log('Request URL:', req.originalUrl);
//   console.log('Origin:', req.headers.origin);
//   console.log('Cookie header:', req.headers.cookie);
//   console.log('Parsed cookies:', req.cookies);

//   next();
// });

// Serve static files
app.use(express.static(path.join(path.resolve(), 'public')));

app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome to API v2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Router
app.use('/api/v1/auth', userRouter);
app.use('/api/v1/course', courseRouter);
app.use('/api/v1/student', studentRouter);
app.use('/api/v1/instructor', instructorRouter);

app.use(globalErrorHandler);
