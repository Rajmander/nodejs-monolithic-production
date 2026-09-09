/**
 * @file request-id.middleware.js
 * @description Injects and preserves a unique UUID correlation ID on all incoming HTTP requests.
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Middleware that assigns a unique correlation ID to every incoming request.
 * Respects incoming 'X-Request-Id' header if present.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function requestIdMiddleware(req, res, next) {
  const existingId = req.headers['x-request-id'];
  const requestId = typeof existingId === 'string' && existingId.trim() ? existingId : uuidv4();

  req.id = requestId;
  req.startTime = Date.now();
  res.setHeader('X-Request-Id', requestId);

  next();
}
