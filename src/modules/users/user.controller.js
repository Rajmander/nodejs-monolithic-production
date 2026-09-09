/**
 * @file user.controller.js
 * @description HTTP Controller handling User endpoints.
 */

import { userService } from './user.service.js';
import { UnauthorizedError } from '../../core/errors/index.js';
import { ResponseUtil } from '../../utils/index.js';

export class UserController {
  /** @type {import('./user.service.js').UserService} */
  #service;

  /**
   * @param {import('./user.service.js').UserService} [service=userService]
   */
  constructor(service = userService) {
    this.#service = service;
  }

  /**
   * GET /api/v1/users/me
   * Retrieves profile of current authenticated user.
   */
  getMe = async (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Not authenticated');
      }
      const user = await this.#service.getUserById(req.user.id);
      ResponseUtil.sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/v1/users/me
   * Updates profile of current authenticated user.
   */
  updateMe = async (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Not authenticated');
      }
      const user = await this.#service.updateUser(req.user.id, req.body);
      ResponseUtil.sendSuccess(res, user, 200, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/users
   * Lists users with pagination and filtering (Admin/Manager role).
   */
  listUsers = async (req, res, next) => {
    try {
      const result = await this.#service.listUsers(req.query);
      ResponseUtil.sendSuccess(res, result.items, 200, undefined, {
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/users/:id
   * Retrieves user by ID.
   */
  getUserById = async (req, res, next) => {
    try {
      const user = await this.#service.getUserById(req.params.id);
      ResponseUtil.sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();
export default userController;
