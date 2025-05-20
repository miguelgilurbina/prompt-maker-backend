// backend/src/routes/authRoutes.ts
import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { auth } from '../middlewares/auth';

const router = Router();

// @route   POST /api/auth/register
// @desc    Registrar un nuevo usuario
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Autenticar usuario y obtener token
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Obtener datos del usuario actual
// @access  Private
router.get('/me', auth, getMe);

export default router;
