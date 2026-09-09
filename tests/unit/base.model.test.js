import { describe, it, expect } from 'vitest';

import { BaseModel } from '../../src/core/database/base.model.js';

describe('BaseModel', () => {
  it('should initialize with default timestamps if not provided', () => {
    const model = new BaseModel({ id: 'base-1' });
    expect(model.id).toBe('base-1');
    expect(model.createdAt).toBeInstanceOf(Date);
    expect(model.updatedAt).toBeInstanceOf(Date);
  });

  it('should preserve provided custom timestamps and serialize to JSON', () => {
    const customCreated = new Date('2026-01-01T00:00:00Z');
    const customUpdated = new Date('2026-01-02T00:00:00Z');
    const model = new BaseModel({
      id: 'base-2',
      createdAt: customCreated,
      updatedAt: customUpdated,
    });

    expect(model.createdAt.toISOString()).toBe(customCreated.toISOString());
    expect(model.updatedAt.toISOString()).toBe(customUpdated.toISOString());

    const json = model.toJSON();
    expect(json.id).toBe('base-2');
  });
});
