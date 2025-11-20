import pino from 'pino';
import { env } from '../config/env';

/**
 * Logger class that wraps Pino for structured logging.
 * Hides the underlying logging implementation for easy swapping in the future.
 */
export class Logger {
  private logger: pino.Logger;

  constructor() {
    this.logger = pino({
      level: env.LOG_LEVEL,
      transport: env.LOG_PRETTY
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
    });
  }

  info(message: string, context?: object): void {
    this.logger.info(context, message);
  }

  error(message: string, error?: Error | unknown, context?: object): void {
    if (error instanceof Error) {
      this.logger.error({ ...context, err: error }, message);
    } else {
      this.logger.error({ ...context, error }, message);
    }
  }

  warn(message: string, context?: object): void {
    this.logger.warn(context, message);
  }

  debug(message: string, context?: object): void {
    this.logger.debug(context, message);
  }

  trace(message: string, context?: object): void {
    this.logger.trace(context, message);
  }

  fatal(message: string, error?: Error | unknown, context?: object): void {
    if (error instanceof Error) {
      this.logger.fatal({ ...context, err: error }, message);
    } else {
      this.logger.fatal({ ...context, error }, message);
    }
  }
}

// Export singleton instance
export const logger = new Logger();
