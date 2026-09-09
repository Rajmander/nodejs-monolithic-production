import { describe, it, expect } from 'vitest';

import { PaginationUtil } from '../../src/utils/pagination.util.js';

describe('PaginationUtil', () => {
  it('should return defaults when given empty or missing parameters', () => {
    const parsed = PaginationUtil.parse({});
    expect(parsed.page).toBe(1);
    expect(parsed.limit).toBe(10);
    expect(parsed.sortOrder).toBe('asc');
    expect(parsed.sortBy).toBeUndefined();
  });

  it('should parse valid page, limit, and sort parameters', () => {
    const parsed = PaginationUtil.parse({
      page: '3',
      limit: '25',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    expect(parsed.page).toBe(3);
    expect(parsed.limit).toBe(25);
    expect(parsed.sortBy).toBe('createdAt');
    expect(parsed.sortOrder).toBe('desc');
  });

  it('should enforce MAX_LIMIT bounds if limit exceeds 100', () => {
    const parsed = PaginationUtil.parse({ limit: 500 });
    expect(parsed.limit).toBe(100);
  });

  it('should default to page 1 for negative or NaN values', () => {
    const parsed = PaginationUtil.parse({ page: -5 });
    expect(parsed.page).toBe(1);
  });
});
