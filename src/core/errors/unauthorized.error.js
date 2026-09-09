/**
 * @file unauthorized.error.js
 * @description 401 Unauthorized access error.
 */

import { AppError } from './app.error.js';
import { ErrorCode } from '../../constants/error-codes.constant.js';
import { HttpStatus } from '../../constants/http-status.constant.js';

export class UnauthorizedError extends AppError {
  /**
   * @param {string} [message='Unauthorized access'] Error message
   * @param {string} [errorCode=ErrorCode.UNAUTHORIZED] Machine-readable error code
   */
  constructor(message = 'Unauthorized access', errorCode = ErrorCode.UNAUTHORIZED) {
    super(message, HttpStatus.UNAUTHORIZED, errorCode, true);
  }
}
