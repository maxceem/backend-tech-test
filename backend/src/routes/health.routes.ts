import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';
import { HealthService } from '../services/health.service';
import { logger } from '../utils/logger';

const router = Router();
const healthService = new HealthService(logger);
const controller = new HealthController(healthService);

router.get('/', controller.checkHealth);

export default router;
