import { Request, Response } from 'express';
import Prompt from '../models/Prompt.model';
import User, { IUser } from '../models/User.model';
import mongoose, { Types } from 'mongoose';

interface UserWithUsername extends IUser {
  username: string;
}

// @desc    Crear un nuevo prompt
// @access  Private
export const createPrompt = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, description, variables, tags, categoryId, isPublic } = req.body;

    // Fetch the user to get their username
    const user = await User.findById(req.user?.id).select('username').lean<UserWithUsername>();
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const newPrompt = new Prompt({
      title,
      content,
      description,
      variables: variables || [],
      tags: tags || [],
      userId: req.user?.id,
      authorName: user.username || 'Anonymous',
      categoryId: categoryId || null,
      isPublic: isPublic || false,
    });

    const savedPrompt = await newPrompt.save();
    res.status(201).json(savedPrompt);
  } catch (error) {
    console.error('Create prompt error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Obtener todos los prompts del usuario
// @access  Private
export const getUserPrompts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = { userId: req.user?.id };

    if (req.query.category) {
      filter.categoryId = req.query.category;
    }
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      filter.$or = [{ title: searchRegex }, { content: searchRegex }, { tags: searchRegex }];
    }

    const prompts = await Prompt.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 })
      .populate('categoryId', 'name');

    const total = await Prompt.countDocuments(filter);

    res.json({ prompts, pagination: { total, page, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('Get user prompts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Obtener un prompt específico
// @access  Private (con comprobación para prompts públicos)
export const getPromptById = async (req: Request, res: Response): Promise<void> => {
  try {
    const promptId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(promptId)) {
      res.status(400).json({ message: 'Invalid prompt ID' });
      return;
    }
    const prompt = await Prompt.findById(promptId).populate('categoryId', 'name');
    if (!prompt) {
      res.status(404).json({ message: 'Prompt not found' });
      return;
    }
    if (!prompt.isPublic && (!prompt.userId || prompt.userId.toString() !== req.user?.id)) {
      res.status(403).json({ message: 'Not authorized to access this prompt' });
      return;
    }
    res.json(prompt);
  } catch (error) {
    console.error('Get prompt by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Actualizar un prompt
// @access  Private
export const updatePrompt = async (req: Request, res: Response): Promise<void> => {
  try {
    const promptId = req.params.id;
    const { title, content, description, variables, tags, categoryId, isPublic } = req.body;
    if (!mongoose.Types.ObjectId.isValid(promptId)) {
      res.status(400).json({ message: 'Invalid prompt ID' });
      return;
    }
    const prompt = await Prompt.findById(promptId);
    if (!prompt) {
      res.status(404).json({ message: 'Prompt not found' });
      return;
    }
    if (!prompt.userId || prompt.userId.toString() !== req.user?.id) {
      res.status(403).json({ message: 'Not authorized to update this prompt' });
      return;
    }
    const updatedPrompt = await Prompt.findByIdAndUpdate(promptId, { title, content, description, variables, tags, categoryId, isPublic }, { new: true });
    res.json(updatedPrompt);
  } catch (error) {
    console.error('Update prompt error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Eliminar un prompt
// @access  Private
export const deletePrompt = async (req: Request, res: Response): Promise<void> => {
  try {
    const promptId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(promptId)) {
      res.status(400).json({ message: 'Invalid prompt ID' });
      return;
    }
    const prompt = await Prompt.findById(promptId);
    if (!prompt) {
      res.status(404).json({ message: 'Prompt not found' });
      return;
    }
    if (!prompt.userId || prompt.userId.toString() !== req.user?.id) {
      res.status(403).json({ message: 'Not authorized to delete this prompt' });
      return;
    }
    await Prompt.findByIdAndDelete(promptId);
    res.json({ message: 'Prompt successfully deleted' });
  } catch (error) {
    console.error('Delete prompt error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
