/**
 * @file rate-limiter.middleware.js
 * @description IP-based rate limiting middlewares protecting endpoints against brute force and DoS.
 */

import rateLimit from 'express-rate-limit';

import { config } from '../../config/index.js';
import { ErrorCode } from '../../constants/error-codes.constant.js';
import { HttpStatus } from '../../constants/http-status.constant.js';

/**
 * Standard API rate limiter.
 */
export const rateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(HttpStatus.TOO_MANY_REQUESTS).json({
      type: 'https://errors.api.enterprise.com/rate-limit-exceeded',
      title: 'Rate Limit Exceeded',
      status: HttpStatus.TOO_MANY_REQUESTS,
      detail: 'Too many requests received from this IP address, please try again later.',
      instance: req.originalUrl,
      code: ErrorCode.RATE_LIMIT_EXCEEDED,
      timestamp: new Date().toISOString(),
    });
  },
});

/**
 * Strict rate limiter for authentication routes (login / register).
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(HttpStatus.TOO_MANY_REQUESTS).json({
      type: 'https://errors.api.enterprise.com/rate-limit-exceeded',
      title: 'Authentication Rate Limit Exceeded',
      status: HttpStatus.TOO_MANY_REQUESTS,
      detail:
        'Too many authentication attempts from this IP address, please retry after 15 minutes.',
      instance: req.originalUrl,
      code: ErrorCode.RATE_LIMIT_EXCEEDED,
      timestamp: new Date().toISOString(),
    });
  },
});
