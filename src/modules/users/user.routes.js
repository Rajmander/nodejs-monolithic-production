/**
 * @file user.routes.js
 * @description User route definitions.
 */

import { Router } from 'express';

import { userController } from './user.controller.js';
import { queryUserSchema, updateUserSchema } from './user.dto.js';
import { UserRole } from '../../constants/roles.constant.js';
import { authenticate, authorize, validate } from '../../core/middlewares/index.js';

const router = Router();

// Authentication guard applied to all user routes
router.use(authenticate);

router.get('/me', userController.getMe);
router.patch('/me', validate({ body: updateUserSchema }), userController.updateMe);
router.get(
  '/',
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate({ query: queryUserSchema }),
  userController.listUsers,
);
router.get('/:id', authorize(UserRole.ADMIN, UserRole.MANAGER), userController.getUserById);

export const userRoutes = router;
export default userRoutes;
