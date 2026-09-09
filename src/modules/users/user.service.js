/**
 * @file user.service.js
 * @description Business logic layer for User domain operations.
 */

import { User } from './models/user.model.js';
import { sanitizeUser } from './user.dto.js';
import { userRepository } from './user.repository.js';
import { NotFoundError } from '../../core/errors/index.js';
import { logger } from '../../core/logger/index.js';

/**
 * User Service encapsulating user management logic.
 */
export class UserService {
  /** @type {import('./user.repository.js').UserRepository} */
  #userRepo;

  /**
   * @param {import('./user.repository.js').UserRepository} [userRepo=userRepository]
   */
  constructor(userRepo = userRepository) {
    this.#userRepo = userRepo;
  }

  /**
   * Retrieves sanitized user profile by user ID.
   * @param {string} userId User primary key
   * @returns {Promise<Object>} Sanitized user object
   * @throws {NotFoundError} If user not found
   */
  async getUserById(userId) {
    const user = await this.#userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError(`User with ID '${userId}' not found`);
    }
    return sanitizeUser(user);
  }

  /**
   * Updates user profile fields.
   * @param {string} userId User ID
   * @param {Object} updateData Partial profile updates
   * @returns {Promise<Object>} Updated sanitized user object
   * @throws {NotFoundError} If user not found
   */
  async updateUser(userId, updateData) {
    const existing = await this.#userRepo.findById(userId);
    if (!existing) {
      throw new NotFoundError(`User with ID '${userId}' not found`);
    }

    const updated = await this.#userRepo.update(userId, updateData);
    if (!updated) {
      throw new NotFoundError(`User with ID '${userId}' not found`);
    }

    logger.info({ userId }, 'User profile successfully updated');
    return sanitizeUser(updated);
  }

  /**
   * Lists users with filtering, search, and pagination.
   * @param {Object} query Query options
   * @returns {Promise<import('../../core/database/base.repository.js').PaginatedResult<Object>>}
   */
  async listUsers(query) {
    const { page, limit, sortBy, sortOrder, role, search } = query;

    const result = await this.#userRepo.findAll(role ? { role } : undefined, {
      page,
      limit,
      sortBy,
      sortOrder,
    });

    let items = result.items;

    if (search) {
      const searchLower = search.toLowerCase();
      items = items.filter(
        u =>
          u.email.toLowerCase().includes(searchLower) ||
          u.firstName.toLowerCase().includes(searchLower) ||
          u.lastName.toLowerCase().includes(searchLower),
      );
    }

    return {
      items: items.map(sanitizeUser),
      total: search ? items.length : result.total,
      page: result.page,
      limit: result.limit,
      totalPages: search ? Math.ceil(items.length / limit) || 1 : result.totalPages,
    };
  }
}

export const userService = new UserService();
export default userService;
