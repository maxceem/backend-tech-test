import { Router } from 'express';
import healthRoutes from './health.routes';
import marketRoutes from './market.routes';
import { env } from '../config/env';

const router = Router();

// NOTE: health route don't need base path for k8s/infra probes
router.use('/', healthRoutes);
router.use(env.API_BASE_PATH, marketRoutes);

export default router;
