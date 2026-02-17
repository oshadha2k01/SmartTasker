import { Router } from 'express';
import { registerUser, loginUser, refreshUser } from '../controllers/authController';

const router = Router();

// Endpoint: POST /auth/register
router.post('/register', registerUser);

// Endpoint: POST /auth/login
router.post('/login', loginUser);

// Endpoint: POST /auth/refresh
router.post('/refresh', refreshUser);

export default router;