import { createApp } from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';

await connectDB();
const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`API ready on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

function shutdown(signal) {
  logger.info(`${signal} received - shutting down`);
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => logger.error('Unhandled promise rejection:', reason));
