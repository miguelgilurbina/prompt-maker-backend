// src/routes/promptRoutes.ts
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

// @route   POST /api/prompts
// @desc    Crear un nuevo prompt
// @access  Private
router.post('/', auth, createPrompt);

// @route   GET /api/prompts
// @desc    Obtener todos los prompts del usuario
// @access  Private
router.get('/', auth, getUserPrompts);

// @route   GET /api/prompts/:id
// @desc    Obtener un prompt específico
// @access  Private (con verificación para prompts públicos)
router.get('/:id', auth, getPromptById);

// @route   PUT /api/prompts/:id
// @desc    Actualizar un prompt
// @access  Private
router.put('/:id', auth, updatePrompt);

// @route   DELETE /api/prompts/:id
// @desc    Eliminar un prompt
// @access  Private
router.delete('/:id', auth, deletePrompt);

export default router;
