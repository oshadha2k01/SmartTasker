import { Router } from 'express';
import { registerUser, loginUser, refreshUser } from '../controllers/authController';

const router = Router();


router.post('/register', registerUser);


router.post('/login', loginUser);


router.post('/refresh', refreshUser);

export default router;