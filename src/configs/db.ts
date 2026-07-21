// import mongoose from 'mongoose';
// import { env } from './env.js';

// const uri = env.MONGODB_URI as string;

// export const connectDB = async () => {
//   try {
//     const db = await mongoose.connect(uri, {
//       dbName: 'sample',
//       serverSelectionTimeoutMS: 5000,
//     });

//     console.log(`✅ Database connected: ${db.connection.host}`);
//   } catch (error) {
//     console.error('❌ Database connection failed');
//     throw error;
//   }
// };

// export const disconnectDB = async () => {
//   await mongoose.disconnect();
//   console.log('🔌 Database disconnected');
// };
