import 'reflect-metadata';
import { env } from './config/env';
import { AppDataSource } from './config/database';
import { createApp } from './app';
import { logger } from './utils/logger';

// Initialize TypeORM and start server
AppDataSource.initialize()
  .then(() => {
    logger.info('Database connection established');

    const app = createApp();

    app.listen(env.PORT, () => {
      logger.info(`Server is running on port ${env.PORT}`);
    });
  })
  .catch((error) => {
    logger.fatal('Error during Data Source initialization', error);
    process.exit(1);
  });
