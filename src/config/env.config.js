/**
 * @file env.config.js
 * @description Zod-based environment variable parsing and fail-fast validation.
 */

import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file into process.env
dotenv.config();

/**
 * Zod schema defining required and optional environment configuration parameters.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  HOST: z.string().default('0.0.0.0'),
  CORS_ORIGIN: z.string().default('*'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),

  // JWT Security Tokens
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters long for security compliance')
    .default('super-secure-production-grade-jwt-secret-key-min-32-chars-length'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters long for security compliance')
    .default('super-secure-production-grade-jwt-refresh-secret-min-32-chars'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
});

/**
 * Validates process.env against envSchema.
 * @returns {z.infer<typeof envSchema>} Validated environment object
 * @throws {Error} If environment validation fails with details of missing or invalid variables
 */
export function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const issues = result.error.issues
      .map(issue => `  - [${issue.path.join('.')}]: ${issue.message}`)
      .join('\n');

    throw new Error(
      `[FATAL] Environment Configuration Validation Failed:\n${issues}\nPlease check your .env file.`,
    );
  }

  return result.data;
}
