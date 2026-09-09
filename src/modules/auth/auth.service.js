/**
 * @file auth.service.js
 * @description Authentication service managing user registration, login, token rotation, and domain events.
 */

import { RefreshToken } from './models/refresh-token.model.js';
import { ConflictError, UnauthorizedError } from '../../core/errors/index.js';
import { eventBus } from '../../core/events/index.js';
import { logger } from '../../core/logger/index.js';
import { CryptoUtil } from '../../utils/index.js';
import { sanitizeUser } from '../users/user.dto.js';
import { userRepository } from '../users/user.repository.js';

/**
 * Authentication Service.
 */
export class AuthService {
  /** @type {import('../users/user.repository.js').UserRepository} */
  #userRepo;

  /**
   * Set of revoked refresh tokens for session invalidation.
   * @type {Set<string>}
   */
  #revokedTokens = new Set();

  /**
   * @param {import('../users/user.repository.js').UserRepository} [userRepo=userRepository]
   */
  constructor(userRepo = userRepository) {
    this.#userRepo = userRepo;
  }

  /**
   * Registers a new user.
   * @param {Object} registerDto Registration payload
   * @returns {Promise<{user: Object, tokens: import('../../utils/crypto.util.js').AuthTokens}>}
   * @throws {ConflictError} If email is already registered
   */
  async register(registerDto) {
    const { email, password, firstName, lastName, role } = registerDto;

    const exists = await this.#userRepo.existsByEmail(email);
    if (exists) {
      throw new ConflictError(`Email address '${email}' is already registered`);
    }

    const passwordHash = await CryptoUtil.hashPassword(password);

    const user = await this.#userRepo.create({
      email,
      passwordHash,
      firstName,
      lastName,
      role,
      isActive: true,
      lastLoginAt: new Date(),
    });

    const tokens = CryptoUtil.generateAuthTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    logger.info({ userId: user.id, email: user.email }, 'User registered successfully');

    // Publish domain event for loosely-coupled consumers (e.g. audit log, notifications)
    eventBus.publish('user.registered', {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: sanitizeUser(user),
      tokens,
    };
  }

  /**
   * Authenticates user credentials and issues tokens.
   * @param {Object} loginDto
   * @returns {Promise<{user: Object, tokens: import('../../utils/crypto.util.js').AuthTokens}>}
   * @throws {UnauthorizedError} If invalid credentials or user is inactive
   */
  async login(loginDto) {
    const { email, password } = loginDto;

    const user = await this.#userRepo.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is disabled. Please contact an administrator.');
    }

    const isMatch = await CryptoUtil.comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    await this.#userRepo.update(user.id, { lastLoginAt: new Date() });

    const tokens = CryptoUtil.generateAuthTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    logger.info({ userId: user.id }, 'User logged in successfully');

    eventBus.publish('user.logged_in', {
      userId: user.id,
      email: user.email,
    });

    return {
      user: sanitizeUser(user),
      tokens,
    };
  }

  /**
   * Rotates and refreshes authentication tokens.
   * @param {string} refreshToken
   * @returns {Promise<import('../../utils/crypto.util.js').AuthTokens>}
   * @throws {UnauthorizedError} If refresh token is revoked, invalid, or user inactive
   */
  async refreshTokens(refreshToken) {
    if (this.#revokedTokens.has(refreshToken)) {
      throw new UnauthorizedError('Refresh token has been revoked');
    }

    const payload = CryptoUtil.verifyRefreshToken(refreshToken);

    const user = await this.#userRepo.findById(payload.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User account associated with token is not active');
    }

    // Invalidate the old refresh token (token rotation policy)
    this.#revokedTokens.add(refreshToken);

    const newTokens = CryptoUtil.generateAuthTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    logger.debug({ userId: user.id }, 'Refreshed auth tokens successfully');
    return newTokens;
  }

  /**
   * Logs out user by revoking refresh token.
   * @param {string} refreshToken
   */
  async logout(refreshToken) {
    if (refreshToken) {
      this.#revokedTokens.add(refreshToken);
    }
  }
}

export const authService = new AuthService();
export default authService;
