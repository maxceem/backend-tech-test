import request from 'supertest';
import { createTestApp } from '../helpers/app.helper';
import { MarketsListResponseSchema } from '../../dto/markets-list-response.dto';
import { MarketResponseSchema } from '../../dto/market-response.dto';
import { Chain } from '../../types/chain';
import { TEST_MARKETS } from '../fixtures/market.fixtures';

const app = createTestApp();

describe('GET /markets', () => {
  test('returns all markets with default pagination', async () => {
    const res = await request(app).get('/markets');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      limit: 20,
      page: 1,
      total: 4,
      totalPages: 1,
    });
    expect(res.body.result).toHaveLength(4);
    expect(() => MarketsListResponseSchema.parse(res.body)).not.toThrow();
  });

  test('returns correct structure for each market in results', async () => {
    const res = await request(app).get('/markets');

    expect(res.status).toBe(200);
    expect(() => MarketResponseSchema.parse(res.body.result[0])).not.toThrow();
  });

  test('respects custom limit parameter', async () => {
    const res = await request(app).get('/markets?limit=2');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      limit: 2,
      page: 1,
      total: 4,
      totalPages: 2,
    });
    expect(res.body.result).toHaveLength(2);
  });

  test('respects custom page parameter', async () => {
    const res = await request(app).get('/markets?limit=2&page=2');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      limit: 2,
      page: 2,
      total: 4,
      totalPages: 2,
    });
    expect(res.body.result).toHaveLength(2);
  });

  test('filters by chainId=1 (Ethereum)', async () => {
    const res = await request(app).get('/markets?chainId=1');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      limit: 20,
      page: 1,
      total: 2,
      totalPages: 1,
    });
    expect(res.body.result).toHaveLength(2);
    expect(res.body.result.every((m: any) => m.chainId === Chain.Ethereum)).toBe(true);
  });

  test('filters by chainId=56 (BSC)', async () => {
    const res = await request(app).get('/markets?chainId=56');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      limit: 20,
      page: 1,
      total: 2,
      totalPages: 1,
    });
    expect(res.body.result).toHaveLength(2);
    expect(res.body.result.every((m: any) => m.chainId === Chain.BSC)).toBe(true);
  });

  test('filters by marketName', async () => {
    const res = await request(app).get('/markets?marketName=Token%2001');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      limit: 20,
      page: 1,
      total: 2,
      totalPages: 1,
    });
    expect(res.body.result).toHaveLength(2);
    expect(res.body.result.every((m: any) => m.name === 'Token 01')).toBe(true);
  });

  test('combines chainId and marketName filters', async () => {
    const res = await request(app).get('/markets?chainId=1&marketName=Token%2001');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      limit: 20,
      page: 1,
      total: 1,
      totalPages: 1,
    });
    expect(res.body.result).toHaveLength(1);
    expect(res.body.result[0]).toMatchObject({
      name: 'Token 01',
      chainId: Chain.Ethereum,
    });
  });

  test('combines filters with pagination', async () => {
    const res = await request(app).get('/markets?chainId=1&limit=1&page=1');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      limit: 1,
      page: 1,
      total: 2,
      totalPages: 2,
    });
    expect(res.body.result).toHaveLength(1);
  });

  test('returns empty result for page beyond total', async () => {
    const res = await request(app).get('/markets?page=999');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      limit: 20,
      page: 999,
      total: 4,
      totalPages: 1,
    });
    expect(res.body.result).toHaveLength(0);
  });

  test('returns empty result for non-existent market name', async () => {
    const res = await request(app).get('/markets?marketName=NonExistent');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      limit: 20,
      page: 1,
      total: 0,
      totalPages: 0,
    });
    expect(res.body.result).toHaveLength(0);
  });

  test('returns 400 for invalid chainId', async () => {
    const res = await request(app).get('/markets?chainId=999');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation error');
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'query.chainId',
          message: expect.stringContaining('Chain ID must be one of'),
        }),
      ])
    );
  });

  test('returns 400 for limit exceeding maximum', async () => {
    const res = await request(app).get('/markets?limit=101');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation error');
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'query.limit',
          message: 'Limit must not exceed 100',
        }),
      ])
    );
  });

  test('returns 400 for limit less than 1', async () => {
    const res = await request(app).get('/markets?limit=0');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation error');
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'query.limit',
          message: 'Limit must be at least 1',
        }),
      ])
    );
  });

  test('returns 400 for page less than 1', async () => {
    const res = await request(app).get('/markets?page=0');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation error');
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'query.page',
          message: 'Page must be at least 1',
        }),
      ])
    );
  });

  test('returns 400 for empty marketName after trimming', async () => {
    const res = await request(app).get('/markets?marketName=%20%20');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation error');
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'query.marketName',
          message: 'Market name must not be empty',
        }),
      ])
    );
  });

  test('calculates correct liquidity for each market', async () => {
    const expectedMarket = TEST_MARKETS[0];

    const res = await request(app).get('/markets?marketName=Token%2001&chainId=1');

    expect(res.status).toBe(200);
    expect(res.body.result).toHaveLength(1);

    const market = res.body.result[0];
    const tvl = BigInt(market.tvlCents);
    const borrow = BigInt(market.borrowCents);
    const liquidity = BigInt(market.liquidityCents);

    expect(liquidity).toBe(tvl - borrow);
    expect(market.tvlCents).toBe(expectedMarket.totalSupplyCents);
    expect(market.borrowCents).toBe(expectedMarket.totalBorrowCents);
    expect(market.liquidityCents).toBe(
      (BigInt(expectedMarket.totalSupplyCents) - BigInt(expectedMarket.totalBorrowCents)).toString()
    );
  });
});
