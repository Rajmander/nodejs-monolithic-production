/**
 * @file refresh-token.model.js
 * @description RefreshToken domain entity model representing JWT refresh sessions and revocation status.
 */

import { BaseModel } from '../../../core/database/base.model.js';

/**
 * RefreshToken domain model.
 * @extends BaseModel
 */
export class RefreshToken extends BaseModel {
  /**
   * @param {Object} data Initial token properties
   * @param {string} [data.id] Unique token record ID
   * @param {string} data.userId Associated user primary key
   * @param {string} data.token Signed JWT refresh token string
   * @param {boolean} [data.isRevoked=false] Token revocation flag
   * @param {Date|string} [data.expiresAt] Token expiry timestamp
   * @param {Date|string} [data.createdAt]
   * @param {Date|string} [data.updatedAt]
   */
  constructor({ id, userId, token, isRevoked = false, expiresAt = null, createdAt, updatedAt }) {
    super({ id, createdAt, updatedAt });
    this.userId = userId;
    this.token = token;
    this.isRevoked = Boolean(isRevoked);
    this.expiresAt = expiresAt ? new Date(expiresAt) : null;
  }

  /**
   * Revokes the refresh token.
   */
  revoke() {
    this.isRevoked = true;
    this.updatedAt = new Date();
  }

  /**
   * Determines whether the token has passed its expiration time.
   * @returns {boolean}
   */
  isExpired() {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }

  /**
   * Checks if the token is active, unrevoked, and unexpired.
   * @returns {boolean}
   */
  isValid() {
    return !this.isRevoked && !this.isExpired();
  }

  /**
   * Static factory method to instantiate a new RefreshToken model.
   * @param {Object} data
   * @returns {RefreshToken}
   */
  static create(data) {
    return new RefreshToken(data);
  }
}

export default RefreshToken;
