import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';

import { app } from '../../src/app.js';

describe('Products Endpoints Integration', () => {
  let userToken;
  let adminToken;
  let createdProductId;

  beforeAll(async () => {
    const userRes = await request(app).post('/api/v1/auth/register').send({
      email: 'product.user@enterprise.com',
      password: 'StrongUser123!',
      firstName: 'Product',
      lastName: 'Viewer',
      role: 'user',
    });
    userToken = userRes.body.data.tokens.accessToken;

    const adminRes = await request(app).post('/api/v1/auth/register').send({
      email: 'product.admin@enterprise.com',
      password: 'StrongAdmin123!',
      firstName: 'Product',
      lastName: 'Manager',
      role: 'admin',
    });
    adminToken = adminRes.body.data.tokens.accessToken;
  });

  it('GET /api/v1/products should be publicly accessible and return array', async () => {
    const res = await request(app).get('/api/v1/products');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta.pagination).toBeDefined();
  });

  it('POST /api/v1/products should deny regular users with 403 Forbidden', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Smart Speaker',
        description: 'Voice controlled AI speaker',
        price: 99.99,
        sku: 'SPK-AI-01',
        category: 'Electronics',
        stockQuantity: 25,
      });

    expect(res.status).toBe(403);
    expect(res.body.code).toBe('FORBIDDEN');
  });

  it('POST /api/v1/products should allow admin to create product', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Mechanical Gaming Keyboard',
        description: 'RGB hot-swappable tactile switches',
        price: 129.99,
        sku: 'KB-RGB-01',
        category: 'Accessories',
        stockQuantity: 40,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.sku).toBe('KB-RGB-01');
    expect(res.body.data.isAvailable).toBe(true);

    createdProductId = res.body.data.id;
  });

  it('GET /api/v1/products/:id should return created product details', async () => {
    const res = await request(app).get(`/api/v1/products/${createdProductId}`);

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Mechanical Gaming Keyboard');
    expect(res.body.data.price).toBe(129.99);
  });

  it('PUT /api/v1/products/:id should update product attributes', async () => {
    const res = await request(app)
      .put(`/api/v1/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 119.99, stockQuantity: 35 });

    expect(res.status).toBe(200);
    expect(res.body.data.price).toBe(119.99);
    expect(res.body.data.stockQuantity).toBe(35);
  });

  it('DELETE /api/v1/products/:id should delete product and return 204', async () => {
    const deleteRes = await request(app)
      .delete(`/api/v1/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(deleteRes.status).toBe(204);

    // Verify subsequent GET returns 404
    const getRes = await request(app).get(`/api/v1/products/${createdProductId}`);
    expect(getRes.status).toBe(404);
  });
});
