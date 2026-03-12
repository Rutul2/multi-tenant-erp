import express from 'express';
import { registerBusiness, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Route: POST /api/auth/register
// Purpose: Create a new tenant (business) and admin user
router.post('/register', registerBusiness);

// Route: POST /api/auth/login
// Purpose: Authenticate a user and return a JWT
router.post('/login', loginUser);

export default router;