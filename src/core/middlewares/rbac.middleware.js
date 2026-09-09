/**
 * @file rbac.middleware.js
 * @description Role-Based Access Control (RBAC) guard middleware.
 */

import { ForbiddenError, UnauthorizedError } from '../errors/index.js';

/**
 * Creates an RBAC guard middleware checking if authenticated user has required role.
 * @param {...string} allowedRoles Roles authorized to access the route
 * @returns {import('express').RequestHandler}
 */
export function authorize(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Access denied. Requires one of the following roles: [${allowedRoles.join(', ')}]. Current role: '${req.user.role}'.`,
        ),
      );
    }

    next();
  };
}
