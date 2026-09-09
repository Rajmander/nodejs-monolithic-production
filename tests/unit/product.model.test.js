import { describe, it, expect } from 'vitest';

import { Product } from '../../src/modules/products/models/product.model.js';

describe('Product Domain Model', () => {
  it('should initialize product properties and determine stock availability', () => {
    const product = Product.create({
      id: 'prd-1',
      name: 'Mechanical Keyboard',
      description: 'Tactile switch keyboard',
      price: 149.99,
      sku: 'kb-mech-01',
      category: 'Electronics',
      stockQuantity: 20,
    });

    expect(product.id).toBe('prd-1');
    expect(product.sku).toBe('KB-MECH-01');
    expect(product.isInStock()).toBe(true);
    expect(product.isAvailable).toBe(true);
  });

  it('should update stock quantity and adjust availability automatically', () => {
    const product = Product.create({
      name: 'Wireless Mouse',
      description: 'Bluetooth mouse',
      price: 49.99,
      sku: 'MOU-BT-01',
      category: 'Electronics',
      stockQuantity: 5,
    });

    expect(product.isInStock()).toBe(true);

    product.updateStock(0);
    expect(product.stockQuantity).toBe(0);
    expect(product.isInStock()).toBe(false);
    expect(product.isAvailable).toBe(false);

    product.updateStock(10);
    expect(product.stockQuantity).toBe(10);
    expect(product.isInStock()).toBe(true);
    expect(product.isAvailable).toBe(true);
  });

  it('should calculate discount correctly', () => {
    const product = Product.create({
      name: 'Headphones',
      description: 'Studio headphones',
      price: 100,
      sku: 'HDP-ST-01',
      category: 'Audio',
      stockQuantity: 15,
    });

    product.applyDiscount(20);
    expect(product.price).toBe(80);
  });
});
