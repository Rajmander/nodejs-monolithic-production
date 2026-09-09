/**
 * @file setup.js
 * @description Global test setup configuring environment variables and mocks.
 */

process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.LOG_LEVEL = 'fatal';
process.env.JWT_SECRET = 'test-secret-key-for-vitest-must-be-32-chars-long';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-for-vitest-32-chars-long';
