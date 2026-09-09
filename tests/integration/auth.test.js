import request from 'supertest';
import { describe, it, expect } from 'vitest';

import { app } from '../../src/app.js';

describe('Auth Endpoints Integration', () => {
  const testUser = {
    email: 'integration.user@enterprise.com',
    password: 'SecurePassword123!',
    firstName: 'Dev',
    lastName: 'Tester',
  };

  it('POST /api/v1/auth/register should create user and return tokens', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.data.user.passwordHash).toBeUndefined();
    expect(res.body.data.tokens.accessToken).toBeDefined();
    expect(res.body.data.tokens.refreshToken).toBeDefined();
  });

  it('POST /api/v1/auth/register should return 409 Conflict when registering duplicate email', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(testUser);

    expect(res.status).toBe(409);
    expect(res.body.code).toBe('RESOURCE_ALREADY_EXISTS');
  });

  it('POST /api/v1/auth/register should return 422 Validation Error on weak password', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'weak.pass@enterprise.com',
      password: '123',
      firstName: 'Weak',
      lastName: 'User',
    });

    expect(res.status).toBe(422);
    expect(res.body.code).toBe('VALIDATION_ERROR');
    expect(res.body.errors).toBeDefined();
  });

  it('POST /api/v1/auth/login should authenticate credentials successfully', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tokens.accessToken).toBeDefined();
  });

  it('POST /api/v1/auth/login should reject invalid credentials with 401', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: testUser.email,
      password: 'IncorrectPassword999!',
    });

    expect(res.status).toBe(401);
    expect(res.body.code).toBe('UNAUTHORIZED');
  });

  it('POST /api/v1/auth/refresh should rotate tokens', async () => {
    // First login to obtain fresh tokens
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    const refreshToken = loginRes.body.data.tokens.refreshToken;

    const refreshRes = await request(app).post('/api/v1/auth/refresh').send({ refreshToken });

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.data.accessToken).toBeDefined();
    expect(refreshRes.body.data.refreshToken).toBeDefined();
  });
});
