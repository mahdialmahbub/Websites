import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../lib/logger.js';

export async function connectDB() {
  mongoose.set('strictQuery', true);
  mongoose.connection.on('error', (err) => logger.error('[mongo] connection error:', err.message));
  mongoose.connection.on('disconnected', () => logger.warn('[mongo] disconnected'));

  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10_000, maxPoolSize: 10 });
  logger.info(`[mongo] connected to "${mongoose.connection.name}"`);
}

export const disconnectDB = () => mongoose.disconnect();
