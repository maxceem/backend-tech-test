import request from 'supertest';
import { createTestApp } from '../helpers/app.helper';
import { MarketResponseSchema } from '../../dto/market-response.dto';
import { TEST_MARKETS } from '../fixtures/market.fixtures';

const app = createTestApp();

describe('GET /markets/:id', () => {
  test('returns market by id with correct response shape', async () => {
    const market = TEST_MARKETS[0];

    const res = await request(app).get(`/markets/${market.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: market.id,
      name: market.name,
      chainId: market.chainId,
      tvlCents: market.totalSupplyCents,
      borrowCents: market.totalBorrowCents,
      liquidityCents: (
        BigInt(market.totalSupplyCents) - BigInt(market.totalBorrowCents)
      ).toString(),
    });
    expect(() => MarketResponseSchema.parse(res.body)).not.toThrow();
  });

  test('returns correct calculated values for market', async () => {
    const market = TEST_MARKETS[1];

    const res = await request(app).get(`/markets/${market.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: market.id,
      name: market.name,
      chainId: market.chainId,
      tvlCents: market.totalSupplyCents,
      borrowCents: market.totalBorrowCents,
      liquidityCents: (
        BigInt(market.totalSupplyCents) - BigInt(market.totalBorrowCents)
      ).toString(),
    });
  });

  test('returns 404 for non-existent market id', async () => {
    const res = await request(app).get('/markets/999');

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({
      error: 'Market not found',
    });
  });

  test('returns 400 for invalid market id format', async () => {
    const res = await request(app).get('/markets/invalid');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation error');
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'params.id',
        }),
      ])
    );
  });

  test('returns 400 for negative market id', async () => {
    const res = await request(app).get('/markets/-1');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation error');
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'params.id',
        }),
      ])
    );
  });

  test('returns 400 for market id zero', async () => {
    const res = await request(app).get('/markets/0');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation error');
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'params.id',
        }),
      ])
    );
  });
});
