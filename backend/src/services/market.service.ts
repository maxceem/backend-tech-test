import { SelectQueryBuilder, DataSource, Repository } from 'typeorm';
import { Market } from '../entities/market.entity';
import { Chain } from '../types/chain';

export interface MarketFilters {
  chainId?: Chain;
  marketName?: string;
}

export class MarketService {
  private repository: Repository<Market>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Market);
  }

  private buildQuery(filters: MarketFilters): SelectQueryBuilder<Market> {
    const query = this.repository.createQueryBuilder('market');

    if (filters.chainId) {
      query.andWhere('market.chainId = :chainId', { chainId: filters.chainId });
    }

    if (filters.marketName) {
      query.andWhere('market.name = :marketName', { marketName: filters.marketName });
    }

    return query;
  }

  async calculateTvl(filters: MarketFilters = {}): Promise<string> {
    const result = await this.buildQuery(filters)
      .select('SUM(market.totalSupplyCents)', 'total')
      .getRawOne<{ total: string }>();

    return result?.total ?? '0';
  }

  async calculateLiquidity(filters: MarketFilters = {}): Promise<string> {
    const result = await this.buildQuery(filters)
      .select('SUM(market.totalSupplyCents - market.totalBorrowCents)', 'liquidity')
      .getRawOne<{ liquidity: string }>();

    return result?.liquidity ?? '0';
  }
}
