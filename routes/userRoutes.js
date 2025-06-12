// import express from 'express';
// import authMiddleware from '../middleware/auth.js';
// import { registerUser, loginUser, logoutUser, getProfile, getUserById, getAllUsers, updatePushToken } from '../controllers/userController.js';

// const router = express.Router();

// router.post('/register', registerUser);
// router.post('/login', loginUser);
// router.post('/logout', logoutUser);
// router.get('/me', authMiddleware, getProfile);
// router.get('/:id', authMiddleware, getUserById);
// router.get('/all', authMiddleware, getAllUsers);
// router.post('/push-token', authMiddleware, updatePushToken); // New route

// export default router;

import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { registerUser, loginUser, logoutUser, getProfile, getUserById, getAllUsers, updatePushToken } from '../controllers/userController.js';

const router = express.Router();

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Profile routes
router.get('/me', authMiddleware, getProfile);

// Push token route - MUST come before /:id route
router.post('/push-token', authMiddleware, updatePushToken);

// User management routes
router.get('/all', authMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUserById); // This should come LAST

export default router;