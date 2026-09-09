/**
 * @file server.js
 * @description Server bootstrap entrypoint with graceful shutdown handling and OS signal trapping.
 */

import http from 'http';

import { app } from './app.js';
import { config } from './config/index.js';
import { logger } from './core/logger/index.js';

const server = http.createServer(app);

/**
 * Starts the HTTP server listener.
 */
function startServer() {
  server.listen(config.PORT, config.HOST, () => {
    logger.info(
      {
        port: config.PORT,
        host: config.HOST,
        env: config.NODE_ENV,
        docs: `http://${config.HOST === '0.0.0.0' ? 'localhost' : config.HOST}:${config.PORT}/api/docs`,
        health: `http://${config.HOST === '0.0.0.0' ? 'localhost' : config.HOST}:${config.PORT}/health/ready`,
      },
      `Monolithic Service online on port ${config.PORT} [${config.NODE_ENV}]`,
    );
  });
}

/**
 * Graceful shutdown coordinator.
 * @param {string} signal Trapped OS signal
 */
function gracefulShutdown(signal) {
  logger.warn({ signal }, `Received ${signal}. Commencing graceful server shutdown...`);

  // Close HTTP server to stop accepting new connections
  server.close(err => {
    if (err) {
      logger.error({ err }, 'Error during HTTP server connection drain');
      process.exit(1);
    }
    logger.info('HTTP server closed cleanly. All in-flight requests concluded.');
    process.exit(0);
  });

  // Force shutdown after timeout if connections hang
  const SHUTDOWN_TIMEOUT_MS = 10000;
  setTimeout(() => {
    logger.error('Graceful shutdown timed out. Forcing process exit.');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS).unref();
}

// Trap termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Process-level uncaught error guards
process.on('uncaughtException', err => {
  logger.fatal({ err }, 'FATAL: Uncaught Exception detected');
  process.exit(1);
});

process.on('unhandledRejection', reason => {
  logger.fatal({ reason }, 'FATAL: Unhandled Promise Rejection detected');
  process.exit(1);
});

startServer();
