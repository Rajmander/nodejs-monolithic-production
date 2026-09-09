/**
 * @file request-logger.middleware.js
 * @description HTTP transaction logger recording method, path, response status, duration, and correlation ID.
 */

import { logger } from '../logger/index.js';

/**
 * Request logging middleware.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function requestLoggerMiddleware(req, res, next) {
  const { method, originalUrl, id: requestId } = req;
  const ip = req.ip || req.socket.remoteAddress;

  res.on('finish', () => {
    const duration = req.startTime ? Date.now() - req.startTime : 0;
    const { statusCode } = res;

    const logData = {
      requestId,
      method,
      url: originalUrl,
      statusCode,
      durationMs: duration,
      ip,
    };

    if (statusCode >= 500) {
      logger.error(logData, `HTTP ${method} ${originalUrl} ${statusCode} - ${duration}ms`);
    } else if (statusCode >= 400) {
      logger.warn(logData, `HTTP ${method} ${originalUrl} ${statusCode} - ${duration}ms`);
    } else {
      logger.info(logData, `HTTP ${method} ${originalUrl} ${statusCode} - ${duration}ms`);
    }
  });

  next();
}
