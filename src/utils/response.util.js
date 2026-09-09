/**
 * @file response.util.js
 * @description Standard API response wrapper utility ensuring consistent JSON responses across all endpoints.
 */

import { HttpStatus } from '../constants/http-status.constant.js';

/**
 * Standard API Response Envelope Utility.
 */
export class ResponseUtil {
  /**
   * Sends a standardized success response.
   * @param {import('express').Response} res Express response object
   * @param {*} data Data payload to return
   * @param {number} [statusCode=HttpStatus.OK] HTTP status code
   * @param {string} [message] Optional human-friendly success message
   * @param {Object} [meta] Optional metadata (e.g. pagination, execution time)
   * @returns {import('express').Response}
   */
  static sendSuccess(res, data, statusCode = HttpStatus.OK, message = undefined, meta = undefined) {
    const payload = {
      success: true,
      data,
      ...(message ? { message } : {}),
      ...(meta ? { meta } : {}),
      timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(payload);
  }

  /**
   * Sends a 201 Created response.
   * @param {import('express').Response} res Express response object
   * @param {*} data Data payload of the created resource
   * @param {string} [message='Resource created successfully']
   * @param {Object} [meta]
   * @returns {import('express').Response}
   */
  static sendCreated(res, data, message = 'Resource created successfully', meta = undefined) {
    return this.sendSuccess(res, data, HttpStatus.CREATED, message, meta);
  }

  /**
   * Sends a 204 No Content response.
   * @param {import('express').Response} res Express response object
   * @returns {import('express').Response}
   */
  static sendNoContent(res) {
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
