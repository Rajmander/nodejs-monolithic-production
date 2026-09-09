import request from 'supertest';
import { describe, it, expect } from 'vitest';

import { app } from '../../src/app.js';

describe('Health Endpoints Integration', () => {
  it('GET /health/live should return 200 UP with uptime and X-Request-Id header', async () => {
    const res = await request(app).get('/health/live');

    expect(res.status).toBe(200);
    expect(res.headers['x-request-id']).toBeDefined();
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('UP');
    expect(typeof res.body.data.uptime).toBe('number');
  });

  it('GET /health/ready should return 200 with subsystem health report', async () => {
    const res = await request(app).get('/health/ready');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.checks.database).toBe('HEALTHY');
    expect(res.body.data.checks.eventBus).toBe('HEALTHY');
  });

  it('GET /non-existent-route should return RFC 7807 404 Problem Details', async () => {
    const res = await request(app).get('/non-existent-route');

    expect(res.status).toBe(404);
    expect(res.body.status).toBe(404);
    expect(res.body.code).toBe('RESOURCE_NOT_FOUND');
    expect(res.body.title).toBe('Not Found Error');
  });
});
