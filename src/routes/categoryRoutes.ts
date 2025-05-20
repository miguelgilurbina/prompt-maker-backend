// src/routes/categoryRoutes.ts
import { Router } from 'express';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
} from '../controllers/categoryController';
import { auth } from '../middlewares/auth';

const router = Router();

// @route   GET /api/categories
// @desc    Obtener todas las categorías
// @access  Private
router.get('/', auth, getAllCategories);

// @route   GET /api/categories/:id
// @desc    Obtener una categoría por ID
// @access  Private
router.get('/:id', auth, getCategoryById);

// @route   POST /api/categories
// @desc    Crear una nueva categoría
// @access  Private (podría restringirse a admin)
router.post('/', auth, createCategory);

// @route   PUT /api/categories/:id
// @desc    Actualizar una categoría
// @access  Private (podría restringirse a admin)
router.put('/:id', auth, updateCategory);

// @route   DELETE /api/categories/:id
// @desc    Eliminar una categoría
// @access  Private (podría restringirse a admin)
router.delete('/:id', auth, deleteCategory);

export default router;
