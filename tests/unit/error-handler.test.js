import { describe, it, expect, vi } from 'vitest';

import { BadRequestError, NotFoundError } from '../../src/core/errors/index.js';
import { errorHandlerMiddleware } from '../../src/core/middlewares/error-handler.middleware.js';

describe('errorHandlerMiddleware Unit Tests', () => {
  const createMockRes = () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    return res;
  };

  it('should handle AppError and return corresponding status and Problem Details', () => {
    const req = { id: 'req-1', originalUrl: '/api/v1/test' };
    const res = createMockRes();
    const next = vi.fn();
    const err = new NotFoundError('Item missing');

    errorHandlerMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 404,
        detail: 'Item missing',
        code: 'RESOURCE_NOT_FOUND',
      }),
    );
  });

  it('should handle BadRequestError', () => {
    const req = { id: 'req-2', originalUrl: '/api/v1/bad' };
    const res = createMockRes();
    const next = vi.fn();
    const err = new BadRequestError('Bad input');

    errorHandlerMiddleware(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should handle SyntaxError from bad JSON body', () => {
    const req = { id: 'req-3', originalUrl: '/api/v1/json' };
    const res = createMockRes();
    const next = vi.fn();
    const err = new SyntaxError('Unexpected token in JSON');
    err.status = 400;

    errorHandlerMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Bad Request',
        status: 400,
        detail: 'Malformed JSON payload in request body.',
      }),
    );
  });

  it('should handle unhandled native errors with 500 status', () => {
    const req = { id: 'req-4', originalUrl: '/api/v1/crash' };
    const res = createMockRes();
    const next = vi.fn();
    const err = new Error('Database connection broke unexpectedly');

    errorHandlerMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 500,
        code: 'INTERNAL_SERVER_ERROR',
      }),
    );
  });
});
