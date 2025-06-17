import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}
const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    //Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }
    // Create new user - password hashing is handled by the pre-save hook in the model
    const user = new User({
      email,
      passwordHash: password, // This will be hashed by the pre-save hook
      name,
    });

    await user.save();

    //Generar JWT

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: '30d' } // El token expira en 30 días
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Verify password using the model's method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Generar JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user se establece en el middleware auth
    const user = await User.findById(req.user?.id).select('-passwordHash');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
