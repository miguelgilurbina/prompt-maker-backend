// src/routes/publicPromptRoutes.ts
import express from 'express';
import Prompt from '../models/Prompt.model';
import mongoose from 'mongoose';

const router = express.Router();

// Obtener todos los prompts públicos
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Filtros opcionales
    const filter: any = { isPublic: true };

    if (req.query.category) {
      filter.categoryId = req.query.category;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      filter.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { tags: searchRegex },
      ];
    }

    const prompts = await Prompt.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ votes: -1, updatedAt: -1 }) // Más votados y recientes primero
      .populate('categoryId', 'name');

    const total = await Prompt.countDocuments(filter);

    res.json({
      prompts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get public prompts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Obtener un prompt público específico
router.get('/:id', async (req, res) => {
  try {
    const promptId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(promptId)) {
      return res.status(400).json({ message: 'Invalid prompt ID' });
    }

    const prompt = await Prompt.findById(promptId).populate(
      'categoryId',
      'name'
    );

    if (!prompt || !prompt.isPublic) {
      return res.status(404).json({ message: 'Prompt not found' });
    }

    res.json(prompt);
  } catch (error) {
    console.error('Get public prompt error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Votar por un prompt (sin autenticación para MVP)
router.post('/:id/vote', async (req, res) => {
  try {
    const promptId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(promptId)) {
      return res.status(400).json({ message: 'Invalid prompt ID' });
    }

    const prompt = await Prompt.findById(promptId);

    if (!prompt || !prompt.isPublic) {
      return res.status(404).json({ message: 'Prompt not found' });
    }

    // Incrementar votos
    prompt.votes += 1;
    await prompt.save();

    res.json({ votes: prompt.votes });
  } catch (error) {
    console.error('Vote prompt error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Añadir a publicPromptRoutes.ts
// En publicPromptRoutes.ts, actualizar el router.post('/', ...)
router.post('/', async (req, res) => {
  try {
    console.log('📡 POST /api/public/prompts - Request received');
    console.log('Request body:', req.body);
    
    const {
      title,
      content,
      description,
      variables,
      tags,
      categoryId,
      authorName
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Crear prompt anónimo (sin userId)
    const promptData = {
      title,
      content,
      description: description || '',
      variables: variables || [],
      tags: tags || [],
      categoryId: categoryId || undefined, // null puede causar problemas
      isPublic: true, // Prompts anónimos son públicos
      authorName: authorName || 'Anónimo',
      // NO incluir userId - será undefined/null para prompts anónimos
    };

    console.log('🚀 Creating anonymous prompt with data:', promptData);

    const newPrompt = new Prompt(promptData);
    const savedPrompt = await newPrompt.save();
    
    console.log('✅ Anonymous prompt saved:', savedPrompt._id);
    res.status(201).json(savedPrompt);
    
  } catch (error) {
    console.error('❌ ERROR creating prompt:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: (error instanceof Error ? error.message : String(error))
    });
  }
});

// Añadir comentario a un prompt (sin autenticación para MVP)
router.post('/:id/comment', async (req, res) => {
  try {
    const promptId = req.params.id;
    const { text, authorName } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(promptId)) {
      return res.status(400).json({ message: 'Invalid prompt ID' });
    }

    const prompt = await Prompt.findById(promptId);

    if (!prompt || !prompt.isPublic) {
      return res.status(404).json({ message: 'Prompt not found' });
    }

    // Añadir comentario
    prompt.comments.push({
      text,
      authorName: authorName || 'Anónimo',
    } as any);

    await prompt.save();
    res.status(201).json(prompt.comments[prompt.comments.length - 1]);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



export default router;