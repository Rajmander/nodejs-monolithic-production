import { describe, it, expect } from 'vitest';

import { BaseRepository } from '../../src/core/database/base.repository.js';

describe('BaseRepository Abstract Contract', () => {
  const repo = new BaseRepository();

  it('should throw errors for all abstract methods', async () => {
    await expect(repo.findById('1')).rejects.toThrow('Method findById() must be implemented');
    await expect(repo.findAll()).rejects.toThrow('Method findAll() must be implemented');
    await expect(repo.findOne({})).rejects.toThrow('Method findOne() must be implemented');
    await expect(repo.create({})).rejects.toThrow('Method create() must be implemented');
    await expect(repo.update('1', {})).rejects.toThrow('Method update() must be implemented');
    await expect(repo.delete('1')).rejects.toThrow('Method delete() must be implemented');
    await expect(repo.count()).rejects.toThrow('Method count() must be implemented');
  });
});
