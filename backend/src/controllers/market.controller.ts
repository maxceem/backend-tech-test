import { Request, Response, NextFunction } from 'express';
import { MarketService } from '../services/market.service';
import { marketRequestSchema } from '../dto/market-request.dto';
import { TvlResponse } from '../dto/tvl-response.dto';
import { LiquidityResponse } from '../dto/liquidity-response.dto';
import { asyncHandler } from '../middleware/async-handler.middleware';

export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  getTvl = asyncHandler(async (_req: Request, res: Response, _next: NextFunction, dto) => {
    const marketTvl = await this.marketService.calculateTvl(dto.query);
    const response: TvlResponse = { marketTvl };
    res.status(200).json(response);
  }, marketRequestSchema);

  getLiquidity = asyncHandler(async (_req: Request, res: Response, _next: NextFunction, dto) => {
    const marketLiquidity = await this.marketService.calculateLiquidity(dto.query);
    const response: LiquidityResponse = { marketLiquidity };
    res.status(200).json(response);
  }, marketRequestSchema);
}
