/**
 * @file product.model.js
 * @description Product domain entity model encapsulating catalog attributes and stock logic.
 */

import { BaseModel } from '../../../core/database/base.model.js';

/**
 * Product domain model.
 * @extends BaseModel
 */
export class Product extends BaseModel {
  /**
   * @param {Object} data Initial product properties
   * @param {string} [data.id] Unique product ID
   * @param {string} data.name Product display name
   * @param {string} data.description Detailed description
   * @param {number} data.price Unit price
   * @param {string} data.sku Stock Keeping Unit code
   * @param {string} data.category Product category
   * @param {number} [data.stockQuantity=0] Available inventory count
   * @param {boolean} [data.isAvailable] Availability status
   * @param {Date|string} [data.createdAt]
   * @param {Date|string} [data.updatedAt]
   */
  constructor({
    id,
    name,
    description,
    price,
    sku,
    category,
    stockQuantity = 0,
    isAvailable,
    createdAt,
    updatedAt,
  }) {
    super({ id, createdAt, updatedAt });
    this.name = name?.trim();
    this.description = description?.trim();
    this.price = Number(price);
    this.sku = sku?.toUpperCase().trim();
    this.category = category?.trim();
    this.stockQuantity = Number(stockQuantity);
    this.isAvailable = isAvailable !== undefined ? Boolean(isAvailable) : this.stockQuantity > 0;
  }

  /**
   * Updates inventory stock quantity and synchronizes availability flag.
   * @param {number} quantity New stock count
   */
  updateStock(quantity) {
    this.stockQuantity = Math.max(0, Number(quantity));
    this.isAvailable = this.stockQuantity > 0;
    this.updatedAt = new Date();
  }

  /**
   * Checks if the product is currently in stock.
   * @returns {boolean}
   */
  isInStock() {
    return this.stockQuantity > 0 && this.isAvailable;
  }

  /**
   * Applies a percentage discount to the product price.
   * @param {number} percentage Discount percentage (0-100)
   */
  applyDiscount(percentage) {
    if (percentage > 0 && percentage <= 100) {
      const discount = (this.price * percentage) / 100;
      this.price = Math.round((this.price - discount) * 100) / 100;
      this.updatedAt = new Date();
    }
  }

  /**
   * Static factory method to instantiate a new Product model.
   * @param {Object} data
   * @returns {Product}
   */
  static create(data) {
    return new Product(data);
  }
}

export default Product;
