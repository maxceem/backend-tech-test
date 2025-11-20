import { Request, Response, NextFunction } from 'express';
import { HealthService } from '../services/health.service';
import { asyncHandler } from '../middleware/async-handler.middleware';
import { ServiceUnavailableError } from '../errors/http-error';
import { HealthResponse } from '../dto/health-response.dto';

export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  checkHealth = asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
    try {
      await this.healthService.isDbConnected();

      const response: HealthResponse = {
        status: 'ok',
        message: 'Database is connected.',
      };
      res.status(200).json(response);
    } catch (error) {
      throw new ServiceUnavailableError('Database is disconnected.');
    }
  });
}
