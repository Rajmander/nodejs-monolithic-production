/**
 * @file not-found.error.js
 * @description 404 Resource Not Found error.
 */

import { AppError } from './app.error.js';
import { ErrorCode } from '../../constants/error-codes.constant.js';
import { HttpStatus } from '../../constants/http-status.constant.js';

export class NotFoundError extends AppError {
  /**
   * @param {string} [message='Resource not found'] Error message
   * @param {string} [errorCode=ErrorCode.RESOURCE_NOT_FOUND] Machine-readable error code
   */
  constructor(message = 'Resource not found', errorCode = ErrorCode.RESOURCE_NOT_FOUND) {
    super(message, HttpStatus.NOT_FOUND, errorCode, true);
  }
}
