// routes/notificationRouter.js
import express from 'express';
import {
  createNotification,
  getNotificationsForAdmin,
  markNotificationAsRead
} from '../controllers/notificationController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, createNotification);
router.get('/', authMiddleware, getNotificationsForAdmin);
router.patch('/:id/read', authMiddleware, markNotificationAsRead);

export default router;
