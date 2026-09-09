/**
 * @file conflict.error.js
 * @description 409 Conflict error for unique constraint violations and race conditions.
 */

import { AppError } from './app.error.js';
import { ErrorCode } from '../../constants/error-codes.constant.js';
import { HttpStatus } from '../../constants/http-status.constant.js';

export class ConflictError extends AppError {
  /**
   * @param {string} [message='Resource conflict detected'] Error message
   * @param {string} [errorCode=ErrorCode.RESOURCE_ALREADY_EXISTS] Machine-readable error code
   */
  constructor(
    message = 'Resource conflict detected',
    errorCode = ErrorCode.RESOURCE_ALREADY_EXISTS,
  ) {
    super(message, HttpStatus.CONFLICT, errorCode, true);
  }
}
