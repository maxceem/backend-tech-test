import { ErrorRequestHandler } from 'express';
import { logger } from '../utils/logger';
import { HttpError, InternalServerError } from '../errors/http-error';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // only if HttpError was passed, we return it outside,
  // otherwise we return a general Internal Server Error
  const publicError = err instanceof HttpError ? err : new InternalServerError();
  const logError = err instanceof Error ? err : new Error(String(err));

  // Only log server errors (5xx) - client errors don't need logging
  if (publicError.status >= 500) {
    logger.error('Request handling failed', logError);
  }

  res.status(publicError.status).json({
    error: publicError.message,
    details: publicError.details,
  });
};
