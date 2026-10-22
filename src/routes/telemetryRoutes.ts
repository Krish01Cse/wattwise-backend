import { Router } from 'express';
import { TelemetryController } from '../controllers/telemetryController.js';

const router = Router();

router.get('/overview', TelemetryController.getOverview);
router.get('/history', TelemetryController.getHistory);
router.get('/live', TelemetryController.getLive);
router.post('/record', TelemetryController.record);

export default router;
