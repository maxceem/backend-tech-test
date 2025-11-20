import request from 'supertest';
import { createTestApp } from '../helpers/app.helper';
import { healthResponseSchema } from '../../dto/health-response.dto';

const app = createTestApp();

describe('GET /', () => {
  test('returns 200 when database is connected', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.message).toBeDefined();
    expect(typeof res.body.message).toBe('string');
  });

  test('validates health response schema', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(() => healthResponseSchema.parse(res.body)).not.toThrow();
  });
});
