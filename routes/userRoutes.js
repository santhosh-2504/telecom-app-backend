import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { registerUser, loginUser, logoutUser, getProfile, getUserById, getAllUsers, updatePushToken } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', authMiddleware, getProfile);
router.get('/:id', authMiddleware, getUserById);
router.get('/all', authMiddleware, getAllUsers);
router.post('/push-token', authMiddleware, updatePushToken); // New route

export default router;