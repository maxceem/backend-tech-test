import { Router } from 'express';
import { DataSource } from 'typeorm';
import { createHealthRoutes } from './health.routes';
import { createMarketRoutes } from './market.routes';
import { env } from '../config/env';

export const createRoutes = (dataSource: DataSource): Router => {
  const router = Router();

  // NOTE: health route don't need base path for k8s/infra probes
  router.use('/', createHealthRoutes(dataSource));
  router.use(env.API_BASE_PATH, createMarketRoutes(dataSource));

  return router;
};
