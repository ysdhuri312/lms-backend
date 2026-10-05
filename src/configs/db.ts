import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from './env.js';
import { Pool } from 'pg';

const uri = env.DATABASE_URL as string;
const pool = new Pool({
  connectionString: uri,
});

export const db = drizzle({ client: pool });

export const connectDB = async () => {
  try {
    await pool.query('SELECT 1');
    console.log(`✅ Database connected : ${'localhost'}`);
  } catch (error) {
    console.error('❌ Database connection failed');
    throw error;
  }
};

export const disconnectDB = async () => {
  await pool.end();
  console.log('🔌 Database disconnected');
};
