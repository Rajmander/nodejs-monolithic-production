/**
 * @file app.js
 * @description Express application setup assembling security, middleware pipelines, domain routes, docs, and error handling.
 */

import { readFileSync } from 'fs';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { config } from './config/index.js';
import { NotFoundError } from './core/errors/index.js';
import {
  errorHandlerMiddleware,
  rateLimiter,
  requestIdMiddleware,
  requestLoggerMiddleware,
} from './core/middlewares/index.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { healthRoutes } from './modules/health/health.routes.js';
import { productRoutes } from './modules/products/product.routes.js';
import { userRoutes } from './modules/users/user.routes.js';

const swaggerDocument = JSON.parse(
  readFileSync(new URL('./docs/openapi.json', import.meta.url), 'utf-8'),
);

export function createApp() {
  const app = express();

  // Security Headers via Helmet
  app.use(helmet());

  // Cross-Origin Resource Sharing
  app.use(
    cors({
      origin: config.CORS_ORIGIN === '*' ? '*' : config.CORS_ORIGIN.split(','),
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
      exposedHeaders: ['X-Request-Id'],
    }),
  );

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Tracing and Access Logging
  app.use(requestIdMiddleware);
  app.use(requestLoggerMiddleware);

  // API Documentation via Swagger UI
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Domain Module Routes
  app.use('/health', healthRoutes);

  // Apply rate limiting to API routes
  const apiRouter = express.Router();
  apiRouter.use(rateLimiter);

  apiRouter.use('/auth', authRoutes);
  apiRouter.use('/users', userRoutes);
  apiRouter.use('/products', productRoutes);

  app.use('/api/v1', apiRouter);

  // Catch-all 404 route handler
  app.use((req, _res, next) => {
    next(new NotFoundError(`Endpoint '${req.method} ${req.originalUrl}' does not exist`));
  });

  // Centralized RFC 7807 Error Handling Middleware
  app.use(errorHandlerMiddleware);

  return app;
}

export const app = createApp();
export default app;
