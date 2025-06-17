import { Router } from 'express';
import Prompt from '../models/Prompt.model';
import mongoose from 'mongoose';

const router = Router();

// Crear un prompt anónimo y público
router.post('/', async (req, res) => {
  try {
    const { title, content, description, variables, tags, categoryId, authorName } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    const newPrompt = new Prompt({
      title,
      content,
      description: description || '',
      variables: variables || [],
      tags: tags || [],
      categoryId: categoryId || undefined,
      isPublic: true, // Los prompts de esta ruta son siempre públicos
      authorName: authorName || 'Anónimo',
    });
    const savedPrompt = await newPrompt.save();
    res.status(201).json(savedPrompt);
  } catch (error) {
    console.error('ERROR creating anonymous prompt:', error);
    res.status(500).json({ message: 'Server error', error: (error instanceof Error ? error.message : String(error)) });
  }
});

// Obtener todos los prompts públicos con paginación y filtros
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const filter: any = { isPublic: true };

    if (req.query.category) filter.categoryId = req.query.category;
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      filter.$or = [{ title: searchRegex }, { content: searchRegex }, { tags: searchRegex }];
    }

    const prompts = await Prompt.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ votes: -1, updatedAt: -1 })
      .populate('categoryId', 'name');

    const total = await Prompt.countDocuments(filter);
    res.json({ prompts, pagination: { total, page, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('Get public prompts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Obtener un prompt público específico por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid prompt ID' });
    const prompt = await Prompt.findById(id).populate('categoryId', 'name');
    if (!prompt || !prompt.isPublic) return res.status(404).json({ message: 'Prompt not found' });
    res.json(prompt);
  } catch (error) {
    console.error('Get public prompt error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Votar por un prompt
router.post('/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid prompt ID' });
    const prompt = await Prompt.findById(id);
    if (!prompt || !prompt.isPublic) return res.status(404).json({ message: 'Prompt not found' });
    prompt.votes = (prompt.votes || 0) + 1;
    await prompt.save();
    res.json({ votes: prompt.votes });
  } catch (error) {
    console.error('Vote prompt error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Añadir un comentario a un prompt
router.post('/:id/comment', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, authorName } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid prompt ID' });
    const prompt = await Prompt.findById(id);
    if (!prompt || !prompt.isPublic) return res.status(404).json({ message: 'Prompt not found' });
    prompt.comments.push({ text, authorName: authorName || 'Anónimo' } as any);
    await prompt.save();
    res.status(201).json(prompt.comments[prompt.comments.length - 1]);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;