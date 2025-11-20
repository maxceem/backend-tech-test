import request from 'supertest';
import { createTestApp } from '../helpers/app.helper';
import { EXPECTED_CALCULATIONS } from '../fixtures/market.fixtures';
import { tvlResponseSchema } from '../../dto/tvl-response.dto';

const app = createTestApp();

describe('GET /tvl', () => {
  test('returns total TVL without filters', async () => {
    const res = await request(app).get('/tvl');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ marketTvl: EXPECTED_CALCULATIONS.allMarketsTvl });

    // Validate response schema
    expect(() => tvlResponseSchema.parse(res.body)).not.toThrow();
  });

  test('filters by chainId=1 (Ethereum)', async () => {
    const res = await request(app).get('/tvl?chainId=1');

    expect(res.status).toBe(200);
    expect(res.body.marketTvl).toBe(EXPECTED_CALCULATIONS.chain1Tvl);
    expect(() => tvlResponseSchema.parse(res.body)).not.toThrow();
  });

  test('filters by chainId=56 (BSC)', async () => {
    const res = await request(app).get('/tvl?chainId=56');

    expect(res.status).toBe(200);
    expect(res.body.marketTvl).toBe(EXPECTED_CALCULATIONS.chain56Tvl);
    expect(() => tvlResponseSchema.parse(res.body)).not.toThrow();
  });

  test('filters by marketName', async () => {
    const res = await request(app).get('/tvl?marketName=Token%2001');

    expect(res.status).toBe(200);
    expect(res.body.marketTvl).toBe(EXPECTED_CALCULATIONS.token01Tvl);
    expect(() => tvlResponseSchema.parse(res.body)).not.toThrow();
  });

  test('combines chainId and marketName filters', async () => {
    const res = await request(app).get('/tvl?chainId=1&marketName=Token%2001');

    expect(res.status).toBe(200);
    expect(res.body.marketTvl).toBe(EXPECTED_CALCULATIONS.token01Chain1Tvl);
    expect(() => tvlResponseSchema.parse(res.body)).not.toThrow();
  });

  test('returns 400 for invalid chainId', async () => {
    const res = await request(app).get('/tvl?chainId=999');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation error');
    expect(res.body.details).toBeDefined();
    expect(Array.isArray(res.body.details)).toBe(true);
  });

  test('returns string type for marketTvl', async () => {
    const res = await request(app).get('/tvl');

    expect(res.status).toBe(200);
    expect(typeof res.body.marketTvl).toBe('string');
  });
});
