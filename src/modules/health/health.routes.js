/**
 * @file health.routes.js
 * @description Health probe routing definitions.
 */

import { Router } from 'express';

import { HealthController } from './health.controller.js';

const router = Router();

router.get('/live', HealthController.getLive);
router.get('/ready', HealthController.getReady);

export const healthRoutes = router;
export default healthRoutes;
