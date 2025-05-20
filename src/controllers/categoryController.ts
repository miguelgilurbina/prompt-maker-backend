// src/controllers/categoryController.ts
import { Request, Response } from 'express';
import Category from '../models/Category.model';
import mongoose from 'mongoose';

// @desc    Obtener todas las categorías
// @access  Private (cualquier usuario autenticado)
export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Crear una nueva categoría
// @access  Private (podría restringirse a admin en una implementación más completa)
export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;

    // Validar datos
    if (!name) {
      res.status(400).json({ message: 'Category name is required' });
      return;
    }

    // Verificar si la categoría ya existe
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      res
        .status(400)
        .json({ message: 'Category with this name already exists' });
      return;
    }

    // Crear nueva categoría
    const newCategory = new Category({
      name,
      description: description || '',
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Actualizar una categoría
// @access  Private (podría restringirse a admin)
export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    // Validar que sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      res.status(400).json({ message: 'Invalid category ID' });
      return;
    }

    // Validar datos
    if (!name) {
      res.status(400).json({ message: 'Category name is required' });
      return;
    }

    // Verificar si el nombre ya existe en otra categoría
    const existingCategory = await Category.findOne({
      name,
      _id: { $ne: categoryId },
    });

    if (existingCategory) {
      res
        .status(400)
        .json({ message: 'Category with this name already exists' });
      return;
    }

    // Actualizar categoría
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, description },
      { new: true }
    );

    if (!updatedCategory) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.json(updatedCategory);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Eliminar una categoría
// @access  Private (podría restringirse a admin)
export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categoryId = req.params.id;

    // Validar que sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      res.status(400).json({ message: 'Invalid category ID' });
      return;
    }

    // Verificar si la categoría existe
    const category = await Category.findById(categoryId);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    // Eliminar categoría
    await Category.findByIdAndDelete(categoryId);

    // En una implementación más compleja, podrías querer:
    // 1. Eliminar la categoría de todos los prompts que la usan (o establecerla a null)
    // 2. O bien, impedir la eliminación si hay prompts que la usan

    res.json({ message: 'Category successfully deleted' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Obtener una categoría por ID
// @access  Private
export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categoryId = req.params.id;

    // Validar que sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      res.status(400).json({ message: 'Invalid category ID' });
      return;
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.json(category);
  } catch (error) {
    console.error('Get category by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
