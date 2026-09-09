import { describe, it, expect, beforeEach } from 'vitest';

import { NotFoundError } from '../../src/core/errors/index.js';
import { UserRepository } from '../../src/modules/users/user.repository.js';
import { UserService } from '../../src/modules/users/user.service.js';

describe('UserService', () => {
  let userRepo;
  let userService;

  beforeEach(() => {
    userRepo = new UserRepository();
    userRepo.clear();
    userService = new UserService(userRepo);
  });

  it('should retrieve sanitized user profile by ID', async () => {
    const created = await userRepo.create({
      email: 'jane@enterprise.com',
      passwordHash: '$2a$12$fakehashedsecret',
      firstName: 'Jane',
      lastName: 'Doe',
      role: 'user',
      isActive: true,
    });

    const profile = await userService.getUserById(created.id);
    expect(profile.id).toBe(created.id);
    expect(profile.email).toBe('jane@enterprise.com');
    // Ensure passwordHash is strictly sanitized out
    expect(profile.passwordHash).toBeUndefined();
  });

  it('should throw NotFoundError if user does not exist', async () => {
    await expect(userService.getUserById('non-existent-user')).rejects.toThrow(NotFoundError);
  });

  it('should update user profile details', async () => {
    const created = await userRepo.create({
      email: 'bob@enterprise.com',
      passwordHash: 'hash',
      firstName: 'Bob',
      lastName: 'Smith',
      role: 'user',
      isActive: true,
    });

    const updated = await userService.updateUser(created.id, { firstName: 'Robert' });
    expect(updated.firstName).toBe('Robert');
    expect(updated.lastName).toBe('Smith');
  });

  it('should list users with text search filter', async () => {
    await userRepo.create({
      email: 'alice@enterprise.com',
      passwordHash: 'hash',
      firstName: 'Alice',
      lastName: 'Wonderland',
      role: 'admin',
      isActive: true,
    });

    await userRepo.create({
      email: 'charlie@enterprise.com',
      passwordHash: 'hash',
      firstName: 'Charlie',
      lastName: 'Brown',
      role: 'user',
      isActive: true,
    });

    const searchResult = await userService.listUsers({ search: 'alice', page: 1, limit: 10 });
    expect(searchResult.items.length).toBe(1);
    expect(searchResult.items[0].email).toBe('alice@enterprise.com');
  });
});
