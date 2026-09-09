/**
 * @file index.js
 * @description Validated application configuration singleton.
 */

import { validateEnv } from './env.config.js';

/**
 * Singleton configuration object.
 */
export const config = validateEnv();

export default config;
export * from './env.config.js';
