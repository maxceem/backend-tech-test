import { marketRequestSchema } from '../../dto/market-request.dto';
import { tvlResponseSchema } from '../../dto/tvl-response.dto';
import { liquidityResponseSchema } from '../../dto/liquidity-response.dto';
import { healthResponseSchema } from '../../dto/health-response.dto';
import { Chain } from '../../types/chain-id';

describe('DTO Validation', () => {
  describe('marketRequestSchema', () => {
    test('accepts valid chainId value "1"', () => {
      const result = marketRequestSchema.parse({
        query: { chainId: '1' },
      });

      expect(result.query.chainId).toBe(Chain.Ethereum);
    });

    test('accepts valid chainId value "56"', () => {
      const result = marketRequestSchema.parse({
        query: { chainId: '56' },
      });

      expect(result.query.chainId).toBe(Chain.BSC);
    });

    test('rejects invalid chainId value', () => {
      expect(() => {
        marketRequestSchema.parse({
          query: { chainId: '999' },
        });
      }).toThrow();
    });

    test('accepts optional marketName', () => {
      const result = marketRequestSchema.parse({
        query: { marketName: 'Token 01' },
      });

      expect(result.query.marketName).toBe('Token 01');
    });

    test('accepts both chainId and marketName', () => {
      const result = marketRequestSchema.parse({
        query: { chainId: '1', marketName: 'Token 01' },
      });

      expect(result.query.chainId).toBe(Chain.Ethereum);
      expect(result.query.marketName).toBe('Token 01');
    });

    test('accepts empty query object', () => {
      const result = marketRequestSchema.parse({
        query: {},
      });

      expect(result.query).toBeDefined();
    });
  });

  describe('tvlResponseSchema', () => {
    test('validates string type for marketTvl', () => {
      const result = tvlResponseSchema.parse({
        marketTvl: '12345',
      });

      expect(result.marketTvl).toBe('12345');
    });

    test('rejects number type for marketTvl', () => {
      expect(() => {
        tvlResponseSchema.parse({
          marketTvl: 12345,
        });
      }).toThrow();
    });
  });

  describe('liquidityResponseSchema', () => {
    test('validates string type for marketLiquidity', () => {
      const result = liquidityResponseSchema.parse({
        marketLiquidity: '54321',
      });

      expect(result.marketLiquidity).toBe('54321');
    });

    test('rejects number type for marketLiquidity', () => {
      expect(() => {
        liquidityResponseSchema.parse({
          marketLiquidity: 54321,
        });
      }).toThrow();
    });
  });

  describe('healthResponseSchema', () => {
    test('validates correct health response', () => {
      const result = healthResponseSchema.parse({
        status: 'ok',
        message: 'Database is connected.',
      });

      expect(result.status).toBe('ok');
      expect(result.message).toBe('Database is connected.');
    });

    test('rejects invalid status', () => {
      expect(() => {
        healthResponseSchema.parse({
          status: 'invalid',
          message: 'Test',
        });
      }).toThrow();
    });
  });
});
