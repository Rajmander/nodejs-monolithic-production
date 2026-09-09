import { describe, it, expect, beforeEach } from 'vitest';

import { ConflictError, NotFoundError } from '../../src/core/errors/index.js';
import { ProductRepository } from '../../src/modules/products/product.repository.js';
import { ProductService } from '../../src/modules/products/product.service.js';

describe('ProductService', () => {
  let productRepo;
  let productService;

  beforeEach(() => {
    productRepo = new ProductRepository();
    productRepo.clear();
    productService = new ProductService(productRepo);
  });

  it('should create a product and set availability based on stock', async () => {
    const product = await productService.createProduct({
      name: 'Wireless Mouse',
      description: 'Ergonomic 2.4GHz wireless mouse',
      price: 29.99,
      sku: 'MOU-WL-01',
      category: 'Electronics',
      stockQuantity: 15,
    });

    expect(product.id).toBeDefined();
    expect(product.isAvailable).toBe(true);
    expect(product.sku).toBe('MOU-WL-01');
  });

  it('should throw ConflictError when creating product with duplicate SKU', async () => {
    await productService.createProduct({
      name: 'Item 1',
      description: 'Desc 1',
      price: 10,
      sku: 'SKU-DUP-01',
      category: 'General',
      stockQuantity: 5,
    });

    await expect(
      productService.createProduct({
        name: 'Item 2',
        description: 'Desc 2',
        price: 20,
        sku: 'SKU-DUP-01',
        category: 'General',
        stockQuantity: 10,
      }),
    ).rejects.toThrow(ConflictError);
  });

  it('should retrieve a product by ID', async () => {
    const created = await productService.createProduct({
      name: 'Monitor',
      description: '4K IPS Monitor',
      price: 399.99,
      sku: 'MON-4K-01',
      category: 'Electronics',
      stockQuantity: 8,
    });

    const fetched = await productService.getProductById(created.id);
    expect(fetched.name).toBe('Monitor');
  });

  it('should throw NotFoundError when getting non-existent product', async () => {
    await expect(productService.getProductById('invalid-id')).rejects.toThrow(NotFoundError);
  });

  it('should update product and delete product', async () => {
    const created = await productService.createProduct({
      name: 'Headset',
      description: 'Noise cancelling headset',
      price: 89.99,
      sku: 'HEAD-NC-01',
      category: 'Audio',
      stockQuantity: 20,
    });

    const updated = await productService.updateProduct(created.id, { price: 79.99 });
    expect(updated.price).toBe(79.99);

    await productService.deleteProduct(created.id);
    await expect(productService.getProductById(created.id)).rejects.toThrow(NotFoundError);
  });
});
