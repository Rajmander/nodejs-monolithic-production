/**
 * @file auth.controller.js
 * @description Controller handling authentication endpoints.
 */

import { authService } from './auth.service.js';
import { ResponseUtil } from '../../utils/index.js';

export class AuthController {
  /** @type {import('./auth.service.js').AuthService} */
  #service;

  /**
   * @param {import('./auth.service.js').AuthService} [service=authService]
   */
  constructor(service = authService) {
    this.#service = service;
  }

  /**
   * POST /api/v1/auth/register
   * Registers a new user and returns tokens.
   */
  register = async (req, res, next) => {
    try {
      const result = await this.#service.register(req.body);
      ResponseUtil.sendCreated(res, result, 'User registered successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/login
   * Authenticates credentials and returns tokens.
   */
  login = async (req, res, next) => {
    try {
      const result = await this.#service.login(req.body);
      ResponseUtil.sendSuccess(res, result, 200, 'Login successful');
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/refresh
   * Rotates and refreshes authentication tokens.
   */
  refreshToken = async (req, res, next) => {
    try {
      const tokens = await this.#service.refreshTokens(req.body.refreshToken);
      ResponseUtil.sendSuccess(res, tokens, 200, 'Tokens refreshed successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/logout
   * Revokes refresh token.
   */
  logout = async (req, res, next) => {
    try {
      await this.#service.logout(req.body?.refreshToken);
      ResponseUtil.sendSuccess(res, null, 200, 'Logout successful');
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
export default authController;
