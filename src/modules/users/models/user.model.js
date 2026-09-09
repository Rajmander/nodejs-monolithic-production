/**
 * @file user.model.js
 * @description User domain entity model encapsulating user profile data and state logic.
 */

import { UserRole } from '../../../constants/roles.constant.js';
import { BaseModel } from '../../../core/database/base.model.js';

/**
 * User domain model.
 * @extends BaseModel
 */
export class User extends BaseModel {
  /**
   * @param {Object} data Initial user data
   * @param {string} [data.id] Unique user ID
   * @param {string} data.email Normalized email address
   * @param {string} data.passwordHash Hashed password
   * @param {string} data.firstName User first name
   * @param {string} data.lastName User last name
   * @param {string} [data.role=UserRole.USER] Assigned RBAC role
   * @param {boolean} [data.isActive=true] Account status
   * @param {Date|string} [data.lastLoginAt] Last login timestamp
   * @param {Date|string} [data.createdAt]
   * @param {Date|string} [data.updatedAt]
   */
  constructor({
    id,
    email,
    passwordHash,
    firstName,
    lastName,
    role = UserRole.USER,
    isActive = true,
    lastLoginAt = null,
    createdAt,
    updatedAt,
  }) {
    super({ id, createdAt, updatedAt });
    this.email = email?.toLowerCase().trim();
    this.passwordHash = passwordHash;
    this.firstName = firstName?.trim();
    this.lastName = lastName?.trim();
    this.role = role;
    this.isActive = Boolean(isActive);
    this.lastLoginAt = lastLoginAt ? new Date(lastLoginAt) : null;
  }

  /**
   * Computed full name of the user.
   * @returns {string}
   */
  get fullName() {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }

  /**
   * Checks if user holds any of the specified roles.
   * @param {...string} roles Roles to test
   * @returns {boolean}
   */
  hasRole(...roles) {
    return roles.includes(this.role);
  }

  /**
   * Updates the last login timestamp.
   */
  recordLogin() {
    this.lastLoginAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Deactivates the user account.
   */
  deactivate() {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  /**
   * Activates the user account.
   */
  activate() {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  /**
   * Serializes the user for public API responses, ensuring credentials are excluded.
   * @returns {Object} Sanitized user profile object
   */
  toPublicJSON() {
    const { passwordHash: _, ...publicData } = this.toJSON();
    return {
      ...publicData,
      fullName: this.fullName,
    };
  }

  /**
   * Static factory method to instantiate a new User model.
   * @param {Object} data
   * @returns {User}
   */
  static create(data) {
    return new User(data);
  }
}

export default User;
