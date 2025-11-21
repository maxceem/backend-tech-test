import request from 'supertest';
import { createTestApp } from '../helpers/app.helper';
import { EXPECTED_CALCULATIONS } from '../fixtures/market.fixtures';
import { liquidityResponseSchema } from '../../dto/liquidity-response.dto';

const app = createTestApp();

describe('GET /liquidity', () => {
  test('returns total liquidity without filters', async () => {
    const res = await request(app).get('/liquidity');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ marketLiquidity: EXPECTED_CALCULATIONS.allMarketsLiquidity });
    expect(() => liquidityResponseSchema.parse(res.body)).not.toThrow();
  });

  test('filters by chainId=1 (Ethereum)', async () => {
    const res = await request(app).get('/liquidity?chainId=1');

    expect(res.status).toBe(200);
    expect(res.body.marketLiquidity).toBe(EXPECTED_CALCULATIONS.chain1Liquidity);
    expect(() => liquidityResponseSchema.parse(res.body)).not.toThrow();
  });

  test('filters by chainId=56 (BSC)', async () => {
    const res = await request(app).get('/liquidity?chainId=56');

    expect(res.status).toBe(200);
    expect(res.body.marketLiquidity).toBe(EXPECTED_CALCULATIONS.chain56Liquidity);
    expect(() => liquidityResponseSchema.parse(res.body)).not.toThrow();
  });

  test('filters by marketName', async () => {
    const res = await request(app).get('/liquidity?marketName=Token%2002');

    expect(res.status).toBe(200);
    expect(res.body.marketLiquidity).toBe(EXPECTED_CALCULATIONS.token02Liquidity);
    expect(() => liquidityResponseSchema.parse(res.body)).not.toThrow();
  });

  test('combines chainId and marketName filters', async () => {
    const res = await request(app).get('/liquidity?chainId=1&marketName=Token%2001');

    expect(res.status).toBe(200);
    expect(res.body.marketLiquidity).toBe(EXPECTED_CALCULATIONS.token01Chain1Liquidity);
    expect(() => liquidityResponseSchema.parse(res.body)).not.toThrow();
  });

  test('returns 400 for invalid chainId', async () => {
    const res = await request(app).get('/liquidity?chainId=invalid');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation error');
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'query.chainId',
          message: expect.any(String),
        }),
      ])
    );
  });

  test('returns "0" when filtering by non-existent market name', async () => {
    const res = await request(app).get('/liquidity?marketName=NonExistentMarket');

    expect(res.status).toBe(200);
    expect(res.body.marketLiquidity).toBe('0');
    expect(() => liquidityResponseSchema.parse(res.body)).not.toThrow();
  });

  test('returns 400 when marketName is empty after trimming', async () => {
    const res = await request(app).get('/liquidity?marketName=%20%20');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation error');
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'query.marketName',
          message: expect.any(String),
        }),
      ])
    );
  });

  test('returns 400 for unknown query parameter', async () => {
    const res = await request(app).get('/liquidity?unknown=12');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation error');
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'query',
          message: expect.stringContaining('Unrecognized key'),
        }),
      ])
    );
  });
});
