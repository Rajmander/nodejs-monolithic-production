import { describe, it, expect } from 'vitest';

import { RefreshToken } from '../../src/modules/auth/models/refresh-token.model.js';

describe('RefreshToken Domain Model', () => {
  it('should initialize token and verify validity when not expired or revoked', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60);
    const token = RefreshToken.create({
      id: 'tok-1',
      userId: 'usr-1',
      token: 'jwt-refresh-sample',
      expiresAt: futureDate,
    });

    expect(token.id).toBe('tok-1');
    expect(token.isRevoked).toBe(false);
    expect(token.isExpired()).toBe(false);
    expect(token.isValid()).toBe(true);
  });

  it('should invalidate token on revoke', () => {
    const token = RefreshToken.create({
      userId: 'usr-1',
      token: 'jwt-refresh-sample',
    });

    expect(token.isValid()).toBe(true);
    token.revoke();
    expect(token.isRevoked).toBe(true);
    expect(token.isValid()).toBe(false);
  });

  it('should detect expired tokens', () => {
    const pastDate = new Date(Date.now() - 1000 * 60);
    const token = RefreshToken.create({
      userId: 'usr-1',
      token: 'jwt-refresh-sample',
      expiresAt: pastDate,
    });

    expect(token.isExpired()).toBe(true);
    expect(token.isValid()).toBe(false);
  });
});
