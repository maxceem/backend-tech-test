import request from 'supertest';
import { createTestApp } from '../helpers/app.helper';
import { healthResponseSchema } from '../../dto/health-response.dto';
import { disconnectTestDatabase } from '../helpers/db.helper';
import { logger } from '../../utils/logger';

const app = createTestApp();

describe('GET /', () => {
  test('returns 200 when database is connected', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(() => healthResponseSchema.parse(res.body)).not.toThrow();
  });

  test('returns 503 when database is disconnected', async () => {
    // error log is expected, so let's hide it during test to avoid noise
    const loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation();

    try {
      await disconnectTestDatabase();

      const res = await request(app).get('/');

      expect(res.status).toBe(503);
      expect(res.body.error).toBe('Database is disconnected.');
    } finally {
      loggerErrorSpy.mockRestore();
    }
  });
});
