/**
 * @file app.error.js
 * @description Base Application Error supporting standard RFC 7807 Problem Details serialization.
 */

import { ErrorCode } from '../../constants/error-codes.constant.js';
import { HttpStatus } from '../../constants/http-status.constant.js';

/**
 * @typedef {Object} ProblemDetails
 * @property {string} type URI reference identifying the problem type
 * @property {string} title Short human-readable summary of the problem type
 * @property {number} status HTTP status code
 * @property {string} detail Human-readable explanation specific to this occurrence
 * @property {string} [instance] URI reference identifying the specific occurrence of the problem
 * @property {string} code Machine-readable domain error code
 * @property {string} timestamp ISO timestamp when error was generated
 * @property {*} [errors] Optional field-specific errors
 */

/**
 * Base Application Error class.
 * All domain and operational errors inherit from this class.
 */
export class AppError extends Error {
  /**
   * @param {string} message Human-readable error message
   * @param {number} [statusCode=500] HTTP status code
   * @param {string} [errorCode=ErrorCode.INTERNAL_SERVER_ERROR] Domain error code
   * @param {boolean} [isOperational=true] True if operational/expected error
   * @param {*} [errors] Optional validation errors or context data
   */
  constructor(
    message,
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode = ErrorCode.INTERNAL_SERVER_ERROR,
    isOperational = true,
    errors = undefined,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Converts the error into standard RFC 7807 Problem Details JSON format.
   * @param {string} [instance] Request URI where error occurred
   * @returns {ProblemDetails} RFC 7807 Problem Details object
   */
  toProblemDetails(instance) {
    return {
      type: `https://errors.api.enterprise.com/${this.errorCode.toLowerCase().replace(/_/g, '-')}`,
      title: this.name.replace(/([A-Z])/g, ' $1').trim(),
      status: this.statusCode,
      detail: this.message,
      instance,
      code: this.errorCode,
      timestamp: new Date().toISOString(),
      ...(this.errors ? { errors: this.errors } : {}),
    };
  }
}
