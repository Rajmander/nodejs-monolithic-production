/**
 * @file product.service.js
 * @description Business logic layer for Product catalog domain.
 */

import { Product } from './models/product.model.js';
import { productRepository } from './product.repository.js';
import { ConflictError, NotFoundError } from '../../core/errors/index.js';
import { eventBus } from '../../core/events/index.js';
import { logger } from '../../core/logger/index.js';

export class ProductService {
  /** @type {import('./product.repository.js').ProductRepository} */
  #productRepo;

  /**
   * @param {import('./product.repository.js').ProductRepository} [productRepo=productRepository]
   */
  constructor(productRepo = productRepository) {
    this.#productRepo = productRepo;
  }

  /**
   * Creates a new product.
   * @param {Object} createDto Product creation parameters
   * @returns {Promise<Object>} Created product entity
   * @throws {ConflictError} If SKU already exists
   */
  async createProduct(createDto) {
    const { sku } = createDto;

    const exists = await this.#productRepo.existsBySku(sku);
    if (exists) {
      throw new ConflictError(`Product with SKU '${sku}' already exists`);
    }

    const product = await this.#productRepo.create({
      ...createDto,
      isAvailable: createDto.stockQuantity > 0,
    });

    logger.info({ productId: product.id, sku: product.sku }, 'Product created');

    eventBus.publish('product.created', {
      productId: product.id,
      sku: product.sku,
      name: product.name,
      price: product.price,
    });

    return product;
  }

  /**
   * Retrieves a product by ID.
   * @param {string} productId Product primary key
   * @returns {Promise<Object>} Product entity
   * @throws {NotFoundError} If product not found
   */
  async getProductById(productId) {
    const product = await this.#productRepo.findById(productId);
    if (!product) {
      throw new NotFoundError(`Product with ID '${productId}' not found`);
    }
    return product;
  }

  /**
   * Lists products with filtering, search, price bounding, and pagination.
   * @param {Object} query Query options
   * @returns {Promise<import('../../core/database/base.repository.js').PaginatedResult<Object>>}
   */
  async listProducts(query) {
    const { page, limit, sortBy, sortOrder, category, search, minPrice, maxPrice } = query;

    const baseFilter = category ? { category } : undefined;
    const result = await this.#productRepo.findAll(baseFilter, { page, limit, sortBy, sortOrder });

    let items = result.items;

    // Apply price bounds if specified
    if (minPrice !== undefined) {
      items = items.filter(p => p.price >= minPrice);
    }
    if (maxPrice !== undefined) {
      items = items.filter(p => p.price <= maxPrice);
    }

    // Apply text search on name or description
    if (search) {
      const searchLower = search.toLowerCase();
      items = items.filter(
        p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.sku.toLowerCase().includes(searchLower),
      );
    }

    return {
      items,
      total: search || minPrice || maxPrice ? items.length : result.total,
      page: result.page,
      limit: result.limit,
      totalPages:
        search || minPrice || maxPrice ? Math.ceil(items.length / limit) || 1 : result.totalPages,
    };
  }

  /**
   * Updates an existing product.
   * @param {string} productId Product ID
   * @param {Object} updateDto Partial updates
   * @returns {Promise<Object>} Updated product entity
   * @throws {NotFoundError} If product not found
   * @throws {ConflictError} If updated SKU belongs to another product
   */
  async updateProduct(productId, updateDto) {
    const existing = await this.#productRepo.findById(productId);
    if (!existing) {
      throw new NotFoundError(`Product with ID '${productId}' not found`);
    }

    if (updateDto.sku && updateDto.sku !== existing.sku) {
      const skuTaken = await this.#productRepo.existsBySku(updateDto.sku);
      if (skuTaken) {
        throw new ConflictError(`Product with SKU '${updateDto.sku}' already exists`);
      }
    }

    const updates = {
      ...updateDto,
      ...(updateDto.stockQuantity !== undefined
        ? { isAvailable: updateDto.stockQuantity > 0 }
        : {}),
    };

    const updated = await this.#productRepo.update(productId, updates);
    if (!updated) {
      throw new NotFoundError(`Product with ID '${productId}' not found`);
    }

    logger.info({ productId }, 'Product updated');

    eventBus.publish('product.updated', {
      productId,
      updates,
    });

    return updated;
  }

  /**
   * Deletes a product by ID.
   * @param {string} productId Product ID
   * @throws {NotFoundError} If product not found
   */
  async deleteProduct(productId) {
    const existing = await this.#productRepo.findById(productId);
    if (!existing) {
      throw new NotFoundError(`Product with ID '${productId}' not found`);
    }

    await this.#productRepo.delete(productId);
    logger.info({ productId }, 'Product deleted');

    eventBus.publish('product.deleted', {
      productId,
      sku: existing.sku,
    });
  }
}

export const productService = new ProductService();
export default productService;
