// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}
const JWT_SECRET = process.env.JWT_SECRET;

// Extendemos la interfaz Request para incluir el usuario
import 'express';

declare module 'express' {
  interface Request {
    user?: { id: string };
  }
}

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  // Obtener token del header
  const token = req.header('x-auth-token');

  // Verificar si no hay token
  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied' });
    return;
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    // Agregar usuario al request
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
