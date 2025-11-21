import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';
import { Logger } from './logger';

export class TypeOrmPinoLogger implements TypeOrmLogger {
  constructor(private readonly appLogger: Logger) {}

  logQuery(query: string, parameters?: unknown[], _queryRunner?: QueryRunner) {
    this.appLogger.debug('DB query executed', { query, parameters });
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: unknown[],
    _queryRunner?: QueryRunner
  ) {
    this.appLogger.error('DB query failed', error, { query, parameters });
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[], _queryRunner?: QueryRunner) {
    this.appLogger.warn('DB query slow', { time, query, parameters });
  }

  logSchemaBuild(message: string, _queryRunner?: QueryRunner) {
    this.appLogger.info('DB schema build', { message });
  }

  logMigration(message: string, _queryRunner?: QueryRunner) {
    this.appLogger.info('DB migration', { message });
  }

  log(level: 'log' | 'info' | 'warn', message: unknown, _queryRunner?: QueryRunner) {
    if (level === 'warn') {
      this.appLogger.warn(String(message));
    } else if (level === 'info') {
      this.appLogger.info(String(message));
    } else {
      this.appLogger.debug(String(message));
    }
  }
}
