/**
 * @file logger.js
 * @description High-performance structured JSON logger using Pino with redaction of sensitive credentials.
 */

import pino from 'pino';

import { config } from '../../config/index.js';

const isDevelopment = config.NODE_ENV === 'development';

/**
 * Pino Logger configuration options.
 */
const pinoOptions = {
  level: config.LOG_LEVEL,
  redact: {
    paths: [
      'req.headers.authorization',
      'headers.authorization',
      'password',
      'token',
      'refreshToken',
      'accessToken',
      'secret',
      '*.password',
      '*.token',
    ],
    censor: '[REDACTED]',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: label => ({ level: label.toUpperCase() }),
  },
  ...(isDevelopment
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
      }
    : {}),
};

export const logger = pino(pinoOptions);

export default logger;
