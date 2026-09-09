/**
 * @file product.controller.js
 * @description HTTP Controller handling Product catalog endpoints.
 */

import { productService } from './product.service.js';
import { ResponseUtil } from '../../utils/index.js';

export class ProductController {
  /** @type {import('./product.service.js').ProductService} */
  #service;

  /**
   * @param {import('./product.service.js').ProductService} [service=productService]
   */
  constructor(service = productService) {
    this.#service = service;
  }

  /**
   * POST /api/v1/products
   * Creates a new product (Admin / Manager only).
   */
  createProduct = async (req, res, next) => {
    try {
      const product = await this.#service.createProduct(req.body);
      ResponseUtil.sendCreated(res, product, 'Product created successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/products
   * Lists products with filtering, search, and pagination.
   */
  listProducts = async (req, res, next) => {
    try {
      const result = await this.#service.listProducts(req.query);
      ResponseUtil.sendSuccess(res, result.items, 200, undefined, {
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/products/:id
   * Retrieves product by ID.
   */
  getProductById = async (req, res, next) => {
    try {
      const product = await this.#service.getProductById(req.params.id);
      ResponseUtil.sendSuccess(res, product);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/v1/products/:id
   * Updates an existing product (Admin / Manager only).
   */
  updateProduct = async (req, res, next) => {
    try {
      const product = await this.#service.updateProduct(req.params.id, req.body);
      ResponseUtil.sendSuccess(res, product, 200, 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/v1/products/:id
   * Deletes a product (Admin only).
   */
  deleteProduct = async (req, res, next) => {
    try {
      await this.#service.deleteProduct(req.params.id);
      ResponseUtil.sendNoContent(res);
    } catch (error) {
      next(error);
    }
  };
}

export const productController = new ProductController();
export default productController;
