/**
 * @file in-memory.repository.js
 * @description In-Memory generic repository implementation for local execution, prototyping, and testing.
 */

import { BaseRepository } from './base.repository.js';

/**
 * Generic In-Memory Repository implementation.
 * @extends BaseRepository
 */
export class InMemoryRepository extends BaseRepository {
  /**
   * @protected
   * @type {Map<string, Object>}
   */
  items = new Map();

  /**
   * Generates a pseudo-random unique ID.
   * @protected
   * @returns {string}
   */
  generateId() {
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  }

  /**
   * Finds an entity by primary ID.
   * @override
   * @param {string} id Entity ID
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const item = this.items.get(id);
    return item ? { ...item } : null;
  }

  /**
   * Finds the first entity matching filter criteria.
   * @override
   * @param {Object} filter Field criteria
   * @returns {Promise<Object|null>}
   */
  async findOne(filter) {
    for (const item of this.items.values()) {
      if (this.#matchesFilter(item, filter)) {
        return { ...item };
      }
    }
    return null;
  }

  /**
   * Finds all entities matching optional filter with pagination and sorting.
   * @override
   * @param {Object} [filter] Filter criteria
   * @param {import('./base.repository.js').PaginationOptions} [pagination]
   * @returns {Promise<import('./base.repository.js').PaginatedResult<Object>>}
   */
  async findAll(filter, pagination) {
    let result = Array.from(this.items.values());

    if (filter && Object.keys(filter).length > 0) {
      result = result.filter(item => this.#matchesFilter(item, filter));
    }

    const total = result.length;

    // Apply sorting
    if (pagination?.sortBy) {
      const field = pagination.sortBy;
      const order = pagination.sortOrder === 'desc' ? -1 : 1;
      result.sort((a, b) => {
        const valA = a[field];
        const valB = b[field];
        if (valA === valB) return 0;
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;
        return valA > valB ? order : -order;
      });
    }

    // Apply pagination
    const page = pagination?.page && pagination.page > 0 ? Number(pagination.page) : 1;
    const limit =
      pagination?.limit && pagination.limit > 0 ? Number(pagination.limit) : total || 10;
    const startIndex = (page - 1) * limit;
    const items = result.slice(startIndex, startIndex + limit).map(item => ({ ...item }));
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Creates and stores a new entity.
   * @override
   * @param {Object} entityData Properties
   * @returns {Promise<Object>}
   */
  async create(entityData) {
    const now = new Date();
    const id = this.generateId();
    const newEntity = {
      ...entityData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.items.set(id, newEntity);
    return { ...newEntity };
  }

  /**
   * Updates an existing entity.
   * @override
   * @param {string} id Entity ID
   * @param {Object} updates Partial updates
   * @returns {Promise<Object|null>}
   */
  async update(id, updates) {
    const existing = this.items.get(id);
    if (!existing) {
      return null;
    }

    const updatedEntity = {
      ...existing,
      ...updates,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    };

    this.items.set(id, updatedEntity);
    return { ...updatedEntity };
  }

  /**
   * Deletes an entity by ID.
   * @override
   * @param {string} id Entity ID
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    return this.items.delete(id);
  }

  /**
   * Counts entities matching filter.
   * @override
   * @param {Object} [filter] Criteria
   * @returns {Promise<number>}
   */
  async count(filter) {
    if (!filter || Object.keys(filter).length === 0) {
      return this.items.size;
    }
    let count = 0;
    for (const item of this.items.values()) {
      if (this.#matchesFilter(item, filter)) {
        count++;
      }
    }
    return count;
  }

  /**
   * Clears repository contents (useful in test teardown).
   */
  clear() {
    this.items.clear();
  }

  /**
   * Private helper checking if an item satisfies a filter.
   * @param {Object} item
   * @param {Object} filter
   * @returns {boolean}
   */
  #matchesFilter(item, filter) {
    return Object.keys(filter).every(key => {
      const expected = filter[key];
      if (expected === undefined) return true;
      return item[key] === expected;
    });
  }
}
