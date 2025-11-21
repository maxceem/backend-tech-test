import { Request, Response, NextFunction } from 'express';
import { MarketService } from '../services/market.service';
import { TvlRequestSchema } from '../dto/tvl-request.dto';
import { LiquidityRequestSchema } from '../dto/liquidity-request.dto';
import { MarketByIdRequestSchema } from '../dto/market-by-id-request.dto';
import { TvlResponse } from '../dto/tvl-response.dto';
import { LiquidityResponse } from '../dto/liquidity-response.dto';
import { MarketResponse } from '../dto/market-response.dto';
import { MarketsListResponse } from '../dto/markets-list-response.dto';
import { MarketsListRequestSchema } from '../dto/markets-list-request.dto';
import { asyncHandler } from '../middleware/async-handler.middleware';
import { NotFoundError } from '../errors/http-error';
import { Market } from '../entities/market.entity';

export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  private mapToMarketResponse(market: Market): MarketResponse {
    return {
      id: market.id,
      name: market.name,
      chainId: market.chainId,
      tvlCents: market.totalSupplyCents,
      borrowCents: market.totalBorrowCents,
      liquidityCents: (
        BigInt(market.totalSupplyCents) - BigInt(market.totalBorrowCents)
      ).toString(),
    };
  }

  getTvl = asyncHandler(async (_req: Request, res: Response, _next: NextFunction, dto) => {
    const marketTvl = await this.marketService.calculateTvl(dto.query);
    const response: TvlResponse = { marketTvl };
    res.status(200).json(response);
  }, TvlRequestSchema);

  getLiquidity = asyncHandler(async (_req: Request, res: Response, _next: NextFunction, dto) => {
    const marketLiquidity = await this.marketService.calculateLiquidity(dto.query);
    const response: LiquidityResponse = { marketLiquidity };
    res.status(200).json(response);
  }, LiquidityRequestSchema);

  getMarketById = asyncHandler(async (_req: Request, res: Response, _next: NextFunction, dto) => {
    const { id } = dto.params;

    const market = await this.marketService.findById(id);

    if (!market) {
      throw new NotFoundError('Market not found');
    }

    const response = this.mapToMarketResponse(market);
    res.status(200).json(response);
  }, MarketByIdRequestSchema);

  getMarkets = asyncHandler(async (_req: Request, res: Response, _next: NextFunction, dto) => {
    const { page, limit, chainId, marketName } = dto.query;

    const { markets, total } = await this.marketService.findAll(
      { chainId, marketName },
      page,
      limit
    );

    const totalPages = Math.ceil(total / limit);

    const response: MarketsListResponse = {
      limit,
      page,
      total,
      totalPages,
      result: markets.map((market) => this.mapToMarketResponse(market)),
    };

    res.status(200).json(response);
  }, MarketsListRequestSchema);
}
