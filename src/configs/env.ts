import dotenv from 'dotenv';
import z from 'zod';

const enviroment = process.env.NODE_ENV ?? 'development';

dotenv.config({
  path: `.env.${enviroment}.local`,
});

const envSchema = z.object({
  PORT: z.string().transform((val) => Number(val)),
  NODE_ENV: z.string(),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
