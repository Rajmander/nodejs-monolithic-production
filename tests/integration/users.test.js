import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';

import { app } from '../../src/app.js';

describe('Users Endpoints Integration', () => {
  let userToken;
  let adminToken;

  beforeAll(async () => {
    // Register standard user
    const userRes = await request(app).post('/api/v1/auth/register').send({
      email: 'regular.user@enterprise.com',
      password: 'StrongUser123!',
      firstName: 'Regular',
      lastName: 'User',
      role: 'user',
    });
    userToken = userRes.body.data.tokens.accessToken;

    // Register admin user
    const adminRes = await request(app).post('/api/v1/auth/register').send({
      email: 'admin.user@enterprise.com',
      password: 'StrongAdmin123!',
      firstName: 'Super',
      lastName: 'Admin',
      role: 'admin',
    });
    adminToken = adminRes.body.data.tokens.accessToken;
  });

  it('GET /api/v1/users/me without token should return 401 Unauthorized', async () => {
    const res = await request(app).get('/api/v1/users/me');
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('UNAUTHORIZED');
  });

  it('GET /api/v1/users/me with valid token should return user profile', async () => {
    const res = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('regular.user@enterprise.com');
    expect(res.body.data.passwordHash).toBeUndefined();
  });

  it('PATCH /api/v1/users/me should update profile fields', async () => {
    const res = await request(app)
      .patch('/api/v1/users/me')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ firstName: 'Reggie' });

    expect(res.status).toBe(200);
    expect(res.body.data.firstName).toBe('Reggie');
  });

  it('GET /api/v1/users should forbid regular users with 403 Forbidden', async () => {
    const res = await request(app).get('/api/v1/users').set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    expect(res.body.code).toBe('FORBIDDEN');
  });

  it('GET /api/v1/users should allow admin users with 200 OK and pagination metadata', async () => {
    const res = await request(app)
      .get('/api/v1/users?page=1&limit=10')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta.pagination).toBeDefined();
    expect(res.body.meta.pagination.page).toBe(1);
  });
});
