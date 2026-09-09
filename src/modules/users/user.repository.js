/**
 * @file user.repository.js
 * @description Data access repository for User entities.
 */

import { InMemoryRepository } from '../../core/database/index.js';

/**
 * User Data Access Repository.
 * @extends InMemoryRepository
 */
export class UserRepository extends InMemoryRepository {
  static #instance;

  /**
   * Retrieves singleton instance of UserRepository.
   * @returns {UserRepository}
   */
  static getInstance() {
    if (!UserRepository.#instance) {
      UserRepository.#instance = new UserRepository();
    }
    return UserRepository.#instance;
  }

  /**
   * Finds a user by email address (case-insensitive).
   * @param {string} email User email
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    const normalizedEmail = email.toLowerCase().trim();
    for (const user of this.items.values()) {
      if (user.email.toLowerCase() === normalizedEmail) {
        return { ...user };
      }
    }
    return null;
  }

  /**
   * Checks if a user exists with the given email.
   * @param {string} email User email
   * @returns {Promise<boolean>}
   */
  async existsByEmail(email) {
    const user = await this.findByEmail(email);
    return user !== null;
  }
}

export const userRepository = UserRepository.getInstance();
export default userRepository;
