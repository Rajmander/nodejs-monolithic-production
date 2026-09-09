/**
 * @file auth.routes.js
 * @description Authentication route definitions.
 */

import { Router } from 'express';

import { authController } from './auth.controller.js';
import { loginSchema, refreshTokenSchema, registerSchema } from './auth.dto.js';
import { authRateLimiter, validate } from '../../core/middlewares/index.js';

const router = Router();

router.post(
  '/register',
  authRateLimiter,
  validate({ body: registerSchema }),
  authController.register,
);

router.post('/login', authRateLimiter, validate({ body: loginSchema }), authController.login);

router.post('/refresh', validate({ body: refreshTokenSchema }), authController.refreshToken);

router.post('/logout', authController.logout);

export const authRoutes = router;
export default authRoutes;
