import { Router } from 'express';
import {
  createPrompt,
  getUserPrompts,
  getPromptById,
  updatePrompt,
  deletePrompt,
} from '../controllers/promptController';
import { auth } from '../middlewares/auth';

const router = Router();

// Rutas protegidas que requieren autenticación
router.post('/', auth, createPrompt);
router.get('/', auth, getUserPrompts);
router.get('/:id', auth, getPromptById);
router.put('/:id', auth, updatePrompt);
router.delete('/:id', auth, deletePrompt);

export default router;
