import { describe, it, expect, beforeEach } from 'vitest';

import { InMemoryRepository } from '../../src/core/database/in-memory.repository.js';

describe('InMemoryRepository', () => {
  let repo;

  beforeEach(() => {
    repo = new InMemoryRepository();
  });

  it('should create and retrieve entity by ID', async () => {
    const created = await repo.create({ name: 'Alpha', category: 'Tech' });
    expect(created.id).toBeDefined();
    expect(created.createdAt).toBeInstanceOf(Date);

    const fetched = await repo.findById(created.id);
    expect(fetched).toEqual(created);
  });

  it('should return null when searching for non-existent ID', async () => {
    const fetched = await repo.findById('non-existent-id');
    expect(fetched).toBeNull();
  });

  it('should update an existing entity and update timestamp', async () => {
    const item = await repo.create({ name: 'Initial', score: 10 });
    const updated = await repo.update(item.id, { name: 'Updated', score: 20 });

    expect(updated.name).toBe('Updated');
    expect(updated.score).toBe(20);
    expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(item.createdAt.getTime());
  });

  it('should delete entity by ID', async () => {
    const item = await repo.create({ name: 'To Delete' });
    const deleteResult = await repo.delete(item.id);
    expect(deleteResult).toBe(true);

    const check = await repo.findById(item.id);
    expect(check).toBeNull();
  });

  it('should support pagination, sorting, and count', async () => {
    await repo.create({ name: 'Item C', priority: 3 });
    await repo.create({ name: 'Item A', priority: 1 });
    await repo.create({ name: 'Item B', priority: 2 });

    const count = await repo.count();
    expect(count).toBe(3);

    const paginated = await repo.findAll(undefined, {
      page: 1,
      limit: 2,
      sortBy: 'priority',
      sortOrder: 'asc',
    });

    expect(paginated.total).toBe(3);
    expect(paginated.items.length).toBe(2);
    expect(paginated.items[0].name).toBe('Item A');
    expect(paginated.items[1].name).toBe('Item B');
    expect(paginated.totalPages).toBe(2);
  });
});
