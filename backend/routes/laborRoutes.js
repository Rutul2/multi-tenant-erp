import express from 'express';
import { createLaborLog, getLaborLogs } from '../controllers/laborController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route: POST /api/labor
// Purpose: Create a new labor entry (Protected)
router.post('/', protect, createLaborLog);

// Route: GET /api/labor
// Purpose: Get all labor entries for the logged-in user's business (Protected)
router.get('/', protect, getLaborLogs);

export default router;