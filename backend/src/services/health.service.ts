import { DataSource } from 'typeorm';
import { Logger } from '../utils/logger';

export class HealthService {
  constructor(
    private readonly logger: Logger,
    private readonly dataSource: DataSource
  ) {}

  async isDbConnected(): Promise<void> {
    try {
      await this.dataSource.query('SELECT 1');
    } catch (error) {
      this.logger.error('Database connection check failed', error);
      throw error;
    }
  }
}
