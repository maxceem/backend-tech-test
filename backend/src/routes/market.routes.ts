import { Router } from 'express';
import { MarketController } from '../controllers/market.controller';
import { MarketService } from '../services/market.service';

const router = Router();
const marketService = new MarketService();
const controller = new MarketController(marketService);

router.get('/tvl', controller.getTvl);
router.get('/liquidity', controller.getLiquidity);

export default router;
