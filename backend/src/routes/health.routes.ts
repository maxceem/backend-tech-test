import { Router } from 'express';
import { DataSource } from 'typeorm';
import { HealthController } from '../controllers/health.controller';
import { HealthService } from '../services/health.service';
import { logger } from '../utils/logger';

export const createHealthRoutes = (dataSource: DataSource): Router => {
  const router = Router();
  const healthService = new HealthService(logger, dataSource);
  const controller = new HealthController(healthService);

  router.get('/', controller.checkHealth);

  return router;
};
