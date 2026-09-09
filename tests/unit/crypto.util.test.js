import { describe, it, expect } from 'vitest';

import { UnauthorizedError } from '../../src/core/errors/index.js';
import { CryptoUtil } from '../../src/utils/crypto.util.js';

describe('CryptoUtil', () => {
  it('should hash a password and verify matching password successfully', async () => {
    const rawPassword = 'StrongPassword123!';
    const hash = await CryptoUtil.hashPassword(rawPassword);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(rawPassword);

    const isMatch = await CryptoUtil.comparePassword(rawPassword, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await CryptoUtil.comparePassword('WrongPassword123!', hash);
    expect(isWrongMatch).toBe(false);
  });

  it('should generate and verify valid JWT auth tokens', () => {
    const payload = {
      userId: 'user-uuid-123',
      email: 'test@enterprise.com',
      role: 'admin',
    };

    const tokens = CryptoUtil.generateAuthTokens(payload);
    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();

    const decodedAccess = CryptoUtil.verifyAccessToken(tokens.accessToken);
    expect(decodedAccess.userId).toBe(payload.userId);
    expect(decodedAccess.email).toBe(payload.email);
    expect(decodedAccess.role).toBe(payload.role);

    const decodedRefresh = CryptoUtil.verifyRefreshToken(tokens.refreshToken);
    expect(decodedRefresh.userId).toBe(payload.userId);
  });

  it('should throw UnauthorizedError when verifying forged or invalid token', () => {
    expect(() => CryptoUtil.verifyAccessToken('invalid.jwt.token')).toThrow(UnauthorizedError);
    expect(() => CryptoUtil.verifyRefreshToken('invalid.jwt.token')).toThrow(UnauthorizedError);
  });
});
