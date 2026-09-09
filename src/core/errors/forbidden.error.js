/**
 * @file forbidden.error.js
 * @description 403 Forbidden error.
 */

import { AppError } from './app.error.js';
import { ErrorCode } from '../../constants/error-codes.constant.js';
import { HttpStatus } from '../../constants/http-status.constant.js';

export class ForbiddenError extends AppError {
  /**
   * @param {string} [message='Forbidden - Insufficient permissions to access this resource'] Error message
   * @param {string} [errorCode=ErrorCode.FORBIDDEN] Machine-readable error code
   */
  constructor(
    message = 'Forbidden - Insufficient permissions to access this resource',
    errorCode = ErrorCode.FORBIDDEN,
  ) {
    super(message, HttpStatus.FORBIDDEN, errorCode, true);
  }
}
