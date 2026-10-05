import dotenv from 'dotenv';

const enviroment = process.env.NODE_ENV ?? 'development';

dotenv.config({
  path: `.env.${enviroment}.local`,
});

const { PORT, NODE_ENV, DATABASE_URL } = process.env;
export const env = { PORT, NODE_ENV, DATABASE_URL };
