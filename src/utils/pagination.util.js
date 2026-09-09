/**
 * @file pagination.util.js
 * @description Utility for safely parsing, validating, and bounding pagination query parameters.
 */

/**
 * Utility for pagination query parsing.
 */
export class PaginationUtil {
  static DEFAULT_PAGE = 1;
  static DEFAULT_LIMIT = 10;
  static MAX_LIMIT = 100;

  /**
   * Parses raw query parameters into sanitized and bounded PaginationOptions.
   * @param {Object} params Raw query parameters
   * @param {number|string} [params.page] Page number
   * @param {number|string} [params.limit] Records per page
   * @param {string} [params.sortBy] Field name to sort by
   * @param {string} [params.sortOrder] 'asc' or 'desc'
   * @returns {import('../core/database/base.repository.js').PaginationOptions}
   */
  static parse(params = {}) {
    let page = Number(params.page);
    if (isNaN(page) || page < 1) {
      page = PaginationUtil.DEFAULT_PAGE;
    }

    let limit = Number(params.limit);
    if (isNaN(limit) || limit < 1) {
      limit = PaginationUtil.DEFAULT_LIMIT;
    } else if (limit > PaginationUtil.MAX_LIMIT) {
      limit = PaginationUtil.MAX_LIMIT;
    }

    const sortOrder = params.sortOrder?.toLowerCase() === 'desc' ? 'desc' : 'asc';
    const sortBy = params.sortBy?.trim();

    return {
      page,
      limit,
      ...(sortBy ? { sortBy } : {}),
      sortOrder,
    };
  }
}
