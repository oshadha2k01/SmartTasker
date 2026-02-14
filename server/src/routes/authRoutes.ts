import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';

const router = Router();

// Endpoint: POST /auth/register
router.post('/register', registerUser);

// Endpoint: POST /auth/login
router.post('/login', loginUser);

export default router;