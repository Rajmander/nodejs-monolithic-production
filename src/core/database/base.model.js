/**
 * @file base.model.js
 * @description Abstract Base Model defining core identifier, audit timestamps, and serialization.
 */

/**
 * Base Model representing an identifiable domain entity.
 */
export class BaseModel {
  /**
   * @param {Object} [data] Initial entity properties
   * @param {string} [data.id] Unique entity identifier
   * @param {Date|string} [data.createdAt] Entity creation timestamp
   * @param {Date|string} [data.updatedAt] Entity last update timestamp
   */
  constructor({ id, createdAt, updatedAt } = {}) {
    this.id = id;
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
    this.updatedAt = updatedAt ? new Date(updatedAt) : new Date();
  }

  /**
   * Serializes the model to a plain JavaScript object.
   * @returns {Object}
   */
  toJSON() {
    return { ...this };
  }
}

export default BaseModel;
