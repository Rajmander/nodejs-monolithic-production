/**
 * @file validation.error.js
 * @description 422 Unprocessable Entity error for input schema validation failures.
 */

import { AppError } from './app.error.js';
import { ErrorCode } from '../../constants/error-codes.constant.js';
import { HttpStatus } from '../../constants/http-status.constant.js';

export class ValidationError extends AppError {
  /**
   * @param {string} [message='Validation failed'] Error message
   * @param {Array<{field: string, message: string, code?: string}>|*} [errors] Array of field-level errors
   */
  constructor(message = 'Validation failed', errors = undefined) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY, ErrorCode.VALIDATION_ERROR, true, errors);
  }
}
