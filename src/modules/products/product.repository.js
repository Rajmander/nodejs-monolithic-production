/**
 * @file product.repository.js
 * @description Data access repository for Product catalog entities.
 */

import { InMemoryRepository } from '../../core/database/index.js';

/**
 * Product Data Access Repository.
 * @extends InMemoryRepository
 */
export class ProductRepository extends InMemoryRepository {
  static #instance;

  /**
   * Retrieves singleton instance of ProductRepository.
   * @returns {ProductRepository}
   */
  static getInstance() {
    if (!ProductRepository.#instance) {
      ProductRepository.#instance = new ProductRepository();
    }
    return ProductRepository.#instance;
  }

  /**
   * Finds a product by its unique SKU code.
   * @param {string} sku Stock Keeping Unit
   * @returns {Promise<Object|null>}
   */
  async findBySku(sku) {
    const normalizedSku = sku.toUpperCase().trim();
    for (const product of this.items.values()) {
      if (product.sku === normalizedSku) {
        return { ...product };
      }
    }
    return null;
  }

  /**
   * Checks if a product with the given SKU exists.
   * @param {string} sku Stock Keeping Unit
   * @returns {Promise<boolean>}
   */
  async existsBySku(sku) {
    const product = await this.findBySku(sku);
    return product !== null;
  }
}

export const productRepository = ProductRepository.getInstance();
export default productRepository;
