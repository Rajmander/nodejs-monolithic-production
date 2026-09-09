/**
 * @file product.routes.js
 * @description Product catalog route definitions.
 */

import { Router } from 'express';

import { productController } from './product.controller.js';
import { createProductSchema, queryProductSchema, updateProductSchema } from './product.dto.js';
import { UserRole } from '../../constants/roles.constant.js';
import { authenticate, authorize, validate } from '../../core/middlewares/index.js';

const router = Router();

// Public / Authenticated read routes
router.get('/', validate({ query: queryProductSchema }), productController.listProducts);
router.get('/:id', productController.getProductById);

// Protected mutation routes
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate({ body: createProductSchema }),
  productController.createProduct,
);

router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate({ body: updateProductSchema }),
  productController.updateProduct,
);

router.delete('/:id', authenticate, authorize(UserRole.ADMIN), productController.deleteProduct);

export const productRoutes = router;
export default productRoutes;
