/**
 * @file error-handler.middleware.js
 * @description Global centralized error handling middleware conforming to RFC 7807 Problem Details.
 */

import { config } from '../../config/index.js';
import { ErrorCode } from '../../constants/error-codes.constant.js';
import { HttpStatus } from '../../constants/http-status.constant.js';
import { AppError } from '../errors/index.js';
import { logger } from '../logger/index.js';

/**
 * Global Error Handling Middleware.
 * @param {Error} error
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
export function errorHandlerMiddleware(error, req, res, _next) {
  const requestId = req.id;
  const instance = req.originalUrl;

  // 1. Handled Domain & Operational Errors
  if (error instanceof AppError) {
    logger.warn(
      {
        requestId,
        instance,
        statusCode: error.statusCode,
        errorCode: error.errorCode,
        message: error.message,
        errors: error.errors,
      },
      `Operational Error: ${error.message}`,
    );

    const problem = error.toProblemDetails(instance);
    res.status(error.statusCode).json(problem);
    return;
  }

  // 2. SyntaxError from invalid JSON payload parsing
  if (error instanceof SyntaxError && 'status' in error && error.status === 400) {
    logger.warn({ requestId, instance, err: error.message }, 'Malformed JSON body payload');
    res.status(HttpStatus.BAD_REQUEST).json({
      type: 'https://errors.api.enterprise.com/malformed-json',
      title: 'Bad Request',
      status: HttpStatus.BAD_REQUEST,
      detail: 'Malformed JSON payload in request body.',
      instance,
      code: ErrorCode.BAD_REQUEST,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // 3. Unhandled Programmer Bugs / Internal Server Errors
  logger.error(
    {
      requestId,
      instance,
      err: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    },
    'Unhandled Internal Server Error occurred',
  );

  const isProduction = config.NODE_ENV === 'production';

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    type: 'https://errors.api.enterprise.com/internal-server-error',
    title: 'Internal Server Error',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    detail: isProduction
      ? 'An unexpected error occurred on the server. Please contact support with the request identifier.'
      : error.message,
    instance,
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    timestamp: new Date().toISOString(),
    ...(!isProduction && error.stack ? { errors: { stack: error.stack.split('\n') } } : {}),
  });
}
