import express from 'express';
import { getAnalytics, getWorkerAnalytics } from '../controllers/analyticsController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// General analytics (Admin only)
router.get('/', authMiddleware, getAnalytics);

// Worker-specific analytics (Admin only)
router.get('/worker/:workerId', authMiddleware, getWorkerAnalytics);

export default router;