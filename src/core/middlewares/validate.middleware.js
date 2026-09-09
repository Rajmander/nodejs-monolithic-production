/**
 * @file validate.middleware.js
 * @description Generic request validation middleware using Zod schemas for body, query, and params.
 */

import { ZodError } from 'zod';

import { ValidationError } from '../errors/index.js';

/**
 * Creates Express middleware validating request data against Zod schemas.
 * @param {Object} schemas Validation schemas
 * @param {import('zod').ZodSchema} [schemas.body] Schema for req.body
 * @param {import('zod').ZodSchema} [schemas.query] Schema for req.query
 * @param {import('zod').ZodSchema} [schemas.params] Schema for req.params
 * @returns {import('express').RequestHandler}
 */
export function validate(schemas) {
  return async (req, _res, next) => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
        }));
        next(new ValidationError('Request validation failed', fieldErrors));
      } else {
        next(error);
      }
    }
  };
}
