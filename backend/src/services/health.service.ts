import { AppDataSource } from '../config/database';
import { Logger } from '../utils/logger';

export class HealthService {
  constructor(private readonly logger: Logger) {}

  async isDbConnected(): Promise<void> {
    try {
      await AppDataSource.query('SELECT 1');
    } catch (error) {
      this.logger.error('Database connection check failed', error);
      throw error;
    }
  }
}
