// import express from 'express';
// import {
//   createEntry,
//   getMyEntries,
//   searchEntries,
//   getEntriesByUser,
//   getAllEntries
// } from '../controllers/entryController.js';
// import authMiddleware from '../middleware/auth.js';

// const router = express.Router();

// router.post('/', authMiddleware, createEntry);               // Worker/Admin: Add new entry
// router.get('/mine', authMiddleware, getMyEntries);           // Worker: See own entries
// router.get('/search', authMiddleware, searchEntries);        // Admin: Search by name/date
// router.get('/byUser/:id', authMiddleware, getEntriesByUser); // Admin: Fetch by user
// router.get('/all', authMiddleware, getAllEntries); // Admin: Fetch all entries

// export default router;

import express from 'express';
import {
  createEntry,
  getMyEntries,
  searchEntries,
  getEntriesByUser,
  getAllEntries,
  getEntryById
} from '../controllers/entryController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, createEntry);               // Worker/Admin: Add new entry
router.get('/mine', authMiddleware, getMyEntries);           // Worker: See own entries
router.get('/search', authMiddleware, searchEntries);        // Admin: Search by name/date
router.get('/byUser/:id', authMiddleware, getEntriesByUser); // Admin: Fetch by user
router.get('/all', authMiddleware, getAllEntries);           // Admin: Fetch all entries
router.get('/:id', authMiddleware, getEntryById);            // Get single entry by ID

export default router;