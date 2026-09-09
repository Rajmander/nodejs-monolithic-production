/**
 * @file bad-request.error.js
 * @description 400 Bad Request error.
 */

import { AppError } from './app.error.js';
import { ErrorCode } from '../../constants/error-codes.constant.js';
import { HttpStatus } from '../../constants/http-status.constant.js';

export class BadRequestError extends AppError {
  /**
   * @param {string} [message='Bad Request'] Error message
   * @param {string} [errorCode=ErrorCode.BAD_REQUEST] Machine-readable error code
   * @param {*} [errors] Additional error context
   */
  constructor(message = 'Bad Request', errorCode = ErrorCode.BAD_REQUEST, errors = undefined) {
    super(message, HttpStatus.BAD_REQUEST, errorCode, true, errors);
  }
}
