import request from 'supertest';
import { createTestApp } from '../helpers/app.helper';

const app = createTestApp();

describe('404 Not Found Handler', () => {
  test('returns 404 for non-existent GET route', async () => {
    const res = await request(app).get('/non-existent-route');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('GET');
    expect(res.body.error).toContain('/non-existent-route');
  });

  test('returns 404 for non-existent POST route', async () => {
    const res = await request(app).post('/non-existent-api');

    expect(res.status).toBe(404);
    expect(res.body.error).toContain('POST');
    expect(res.body.error).toContain('/non-existent-api');
  });

  test('existing routes still work correctly', async () => {
    const res = await request(app).get('/');

    expect(res.status).not.toBe(404);
  });
});
