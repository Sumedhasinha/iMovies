// server/src/routes/authRoutes.js
import { Router } from 'express';
import { signup, login, getMe, logout } from '../controllers/authController.js';
import { signupValidator, loginValidator } from '../validators/authValidators.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/signup', authLimiter, signupValidator, validateRequest, signup);
router.post('/login', authLimiter, loginValidator, validateRequest, login);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

export default router;
