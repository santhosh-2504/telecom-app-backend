// routes/analyticsRouter.js
import express from 'express';
import { getDashboardStats } from '../controllers/analyticsController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', authMiddleware, getDashboardStats);

export default router;
