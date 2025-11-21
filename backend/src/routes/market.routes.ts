import { Router } from 'express';
import { DataSource } from 'typeorm';
import { MarketController } from '../controllers/market.controller';
import { MarketService } from '../services/market.service';

export const createMarketRoutes = (dataSource: DataSource): Router => {
  const router = Router();
  const marketService = new MarketService(dataSource);
  const controller = new MarketController(marketService);

  router.get('/tvl', controller.getTvl);
  router.get('/liquidity', controller.getLiquidity);

  return router;
};
