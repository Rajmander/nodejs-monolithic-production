/**
 * @file auth.middleware.js
 * @description Authentication middleware extracting and verifying JWT bearer token.
 */

import { CryptoUtil } from '../../utils/index.js';
import { UnauthorizedError } from '../errors/index.js';

/**
 * Authentication Middleware.
 * Extracts Bearer token from Authorization header and verifies it.
 * @param {import('express').Request} req
 * @param {import('express').Response} _res
 * @param {import('express').NextFunction} next
 */
export function authenticate(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new UnauthorizedError('Missing Authorization header'));
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return next(new UnauthorizedError('Invalid Authorization format. Expected: Bearer <token>'));
  }

  const token = parts[1];
  if (!token) {
    return next(new UnauthorizedError('Token not provided'));
  }

  try {
    const payload = CryptoUtil.verifyAccessToken(token);
    req.user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch (error) {
    next(error);
  }
}
