import { describe, it, expect } from 'vitest';

import { UserRole } from '../../src/constants/roles.constant.js';
import { User } from '../../src/modules/users/models/user.model.js';

describe('User Domain Model', () => {
  it('should initialize correctly with computed fullName', () => {
    const user = User.create({
      id: 'usr-1',
      email: 'ALICE@EXAMPLE.COM',
      passwordHash: '$2a$12$hashedpwd',
      firstName: 'Alice',
      lastName: 'Kingsleigh',
      role: UserRole.ADMIN,
    });

    expect(user.id).toBe('usr-1');
    expect(user.email).toBe('alice@example.com');
    expect(user.fullName).toBe('Alice Kingsleigh');
    expect(user.role).toBe(UserRole.ADMIN);
    expect(user.isActive).toBe(true);
    expect(user.lastLoginAt).toBeNull();
  });

  it('should verify hasRole method', () => {
    const user = User.create({
      email: 'bob@example.com',
      passwordHash: 'hash',
      firstName: 'Bob',
      lastName: 'Builder',
      role: UserRole.MANAGER,
    });

    expect(user.hasRole(UserRole.MANAGER)).toBe(true);
    expect(user.hasRole(UserRole.ADMIN, UserRole.MANAGER)).toBe(true);
    expect(user.hasRole(UserRole.USER)).toBe(false);
  });

  it('should record login and update timestamps', () => {
    const user = User.create({
      email: 'test@example.com',
      passwordHash: 'hash',
      firstName: 'Test',
      lastName: 'User',
    });

    expect(user.lastLoginAt).toBeNull();
    user.recordLogin();
    expect(user.lastLoginAt).toBeInstanceOf(Date);
  });

  it('should toggle active state', () => {
    const user = User.create({
      email: 'active@example.com',
      passwordHash: 'hash',
      firstName: 'Active',
      lastName: 'User',
    });

    user.deactivate();
    expect(user.isActive).toBe(false);

    user.activate();
    expect(user.isActive).toBe(true);
  });

  it('should exclude passwordHash in toPublicJSON', () => {
    const user = User.create({
      id: 'u-99',
      email: 'public@example.com',
      passwordHash: 'sensitive-hash',
      firstName: 'Public',
      lastName: 'Persona',
    });

    const publicJson = user.toPublicJSON();
    expect(publicJson.passwordHash).toBeUndefined();
    expect(publicJson.email).toBe('public@example.com');
    expect(publicJson.fullName).toBe('Public Persona');
  });
});
