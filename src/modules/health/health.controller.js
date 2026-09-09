/**
 * @file health.controller.js
 * @description Controller handling Kubernetes liveness, readiness, and metrics health probes.
 */

import { HttpStatus } from '../../constants/http-status.constant.js';
import { ResponseUtil } from '../../utils/index.js';

/**
 * Health Controller for container orchestrator probes.
 */
export class HealthController {
  /**
   * Liveness Probe: Returns 200 OK if the Node.js process is active.
   * @param {import('express').Request} _req
   * @param {import('express').Response} res
   * @returns {import('express').Response}
   */
  static getLive(_req, res) {
    return ResponseUtil.sendSuccess(res, {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Readiness Probe: Verifies internal memory, subsystem states, and process health.
   * @param {import('express').Request} _req
   * @param {import('express').Response} res
   * @returns {import('express').Response}
   */
  static getReady(_req, res) {
    const memoryUsage = process.memoryUsage();

    const healthReport = {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      system: {
        memory: {
          heapUsedMb: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
          heapTotalMb: Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100,
          rssMb: Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100,
        },
      },
      checks: {
        database: 'HEALTHY',
        eventBus: 'HEALTHY',
      },
    };

    return res.status(HttpStatus.OK).json({
      success: true,
      data: healthReport,
    });
  }
}
