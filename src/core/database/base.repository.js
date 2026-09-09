/**
 * @file base.repository.js
 * @description Abstract Base Repository defining the generic data access contract.
 */

/**
 * @typedef {Object} PaginationOptions
 * @property {number} page 1-indexed page number
 * @property {number} limit Number of records per page
 * @property {string} [sortBy] Field name to sort by
 * @property {'asc'|'desc'} [sortOrder='asc'] Sorting direction
 */

/**
 * @template T
 * @typedef {Object} PaginatedResult
 * @property {T[]} items Result records for the requested page
 * @property {number} total Total count matching filter
 * @property {number} page Current page number
 * @property {number} limit Page limit
 * @property {number} totalPages Total number of pages
 */

/**
 * Abstract Base Repository.
 * All domain repositories inherit or implement this contract.
 * @abstract
 */
export class BaseRepository {
  /**
   * Finds an entity by primary ID.
   * @abstract
   * @param {string} _id Entity primary key
   * @returns {Promise<*|null>}
   */
  async findById(_id) {
    throw new Error('Method findById() must be implemented by subclass');
  }

  /**
   * Finds all entities matching optional filter with pagination.
   * @abstract
   * @param {Object} [_filter] Entity field filter criteria
   * @param {PaginationOptions} [_pagination] Pagination and sorting options
   * @returns {Promise<PaginatedResult<*>>}
   */
  async findAll(_filter, _pagination) {
    throw new Error('Method findAll() must be implemented by subclass');
  }

  /**
   * Finds the first entity matching filter.
   * @abstract
   * @param {Object} _filter Criteria
   * @returns {Promise<*|null>}
   */
  async findOne(_filter) {
    throw new Error('Method findOne() must be implemented by subclass');
  }

  /**
   * Creates and stores a new entity.
   * @abstract
   * @param {Object} _entityData Entity properties
   * @returns {Promise<*>}
   */
  async create(_entityData) {
    throw new Error('Method create() must be implemented by subclass');
  }

  /**
   * Updates an existing entity.
   * @abstract
   * @param {string} _id Entity primary key
   * @param {Object} _updates Partial entity updates
   * @returns {Promise<*|null>}
   */
  async update(_id, _updates) {
    throw new Error('Method update() must be implemented by subclass');
  }

  /**
   * Deletes an entity by ID.
   * @abstract
   * @param {string} _id Entity primary key
   * @returns {Promise<boolean>}
   */
  async delete(_id) {
    throw new Error('Method delete() must be implemented by subclass');
  }

  /**
   * Counts entities matching filter.
   * @abstract
   * @param {Object} [_filter] Criteria
   * @returns {Promise<number>}
   */
  async count(_filter) {
    throw new Error('Method count() must be implemented by subclass');
  }
}
