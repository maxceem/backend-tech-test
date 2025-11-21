import 'reflect-metadata';
import dotenv from 'dotenv';

// NOTE: We should only load config from .env file in this bootstrap script and not inside app.
//       So tests could load their own .env.test file to avoid any mixing.
dotenv.config();

import { env } from './config/env';
import { AppDataSource } from './config/database';
import { createApp } from './app';
import { logger } from './utils/logger';

async function bootstrap() {
  // Initialize database
  await AppDataSource.initialize();
  logger.info('Database connection established');

  // Create application
  const app = createApp(AppDataSource);

  // Start server
  app.listen(env.PORT, () => {
    logger.info(`Server is running on port ${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  logger.fatal('Application startup failed', error);
  process.exit(1);
});
