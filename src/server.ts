// src/server.ts
import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import promptRoutes from './routes/promptRoutes';
import categoryRoutes from './routes/categoryRoutes';
import publicPromptRoutes from './routes/publicPromptRoutes';
import { setupIndexes } from './config/setupDb';



// Cargar variables de entorno
dotenv.config();

// Conexión con MongoDB Atlas

connectDB();

connectDB().then(() => {
  setupIndexes();
  console.log(`Backend server is running on http://localhost:${PORT}`);
});

const app: Application = express();
const PORT = process.env.PORT || 5001;

// Middlewares básicos
app.use(cors()); // Habilitar CORS para permitir peticiones desde el frontend
app.use(express.json()); // Para parsear JSON en el body de las peticiones
app.use(express.urlencoded({ extended: true })); // Para parsear bodies URL-encoded

// Rutas API
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api/prompt', promptRoutes); // Rutas de prompts
app.use('/api/categories', categoryRoutes); // Rutas de categorías
app.use('/api/public/prompts', publicPromptRoutes); // Rutas públicas de prompts

// Ruta de prueba
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is healthy and running!' });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
