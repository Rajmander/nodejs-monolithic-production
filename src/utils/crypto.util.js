/**
 * @file crypto.util.js
 * @description Cryptographic utilities for password hashing with bcrypt and JWT token generation/verification.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { config } from '../config/index.js';
import { UnauthorizedError } from '../core/errors/index.js';

/**
 * @typedef {Object} TokenPayload
 * @property {string} userId User unique ID
 * @property {string} email User email address
 * @property {string} role User RBAC role
 */

/**
 * @typedef {Object} AuthTokens
 * @property {string} accessToken Signed JWT access token
 * @property {string} refreshToken Signed JWT refresh token
 * @property {string} expiresIn Expiration duration string
 */

/**
 * Enterprise Cryptographic and Token Utility.
 */
export class CryptoUtil {
  static #SALT_ROUNDS = 12;

  /**
   * Hashes a plaintext password using bcrypt.
   * @param {string} password Plaintext password
   * @returns {Promise<string>} Hashed password string
   */
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(CryptoUtil.#SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compares a plaintext password against a bcrypt hash.
   * @param {string} password Plaintext password
   * @param {string} hash Bcrypt hash
   * @returns {Promise<boolean>} True if password matches hash
   */
  static async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generates Access Token and Refresh Token pair for an authenticated user.
   * @param {TokenPayload} payload User identification payload
   * @returns {AuthTokens} Token pair and expiration metadata
   */
  static generateAuthTokens(payload) {
    const accessToken = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
      algorithm: 'HS256',
    });

    const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
      algorithm: 'HS256',
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: config.JWT_EXPIRES_IN,
    };
  }

  /**
   * Verifies an Access Token and returns the decoded payload.
   * @param {string} token Signed JWT token
   * @returns {TokenPayload} Decoded user payload
   * @throws {UnauthorizedError} If token is expired, invalid, or forged
   */
  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, config.JWT_SECRET, { algorithms: ['HS256'] });
    } catch {
      throw new UnauthorizedError('Invalid or expired access token');
    }
  }

  /**
   * Verifies a Refresh Token and returns the decoded payload.
   * @param {string} token Signed JWT refresh token
   * @returns {TokenPayload} Decoded user payload
   * @throws {UnauthorizedError} If refresh token is expired, invalid, or forged
   */
  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, config.JWT_REFRESH_SECRET, { algorithms: ['HS256'] });
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }
}
