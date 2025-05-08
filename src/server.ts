// src/server.ts
import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Cargar variables de entorno
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5001; // Puerto diferente al del frontend

// Middlewares básicos
app.use(cors()); // Habilitar CORS para permitir peticiones desde el frontend
app.use(express.json()); // Para parsear JSON en el body de las peticiones
app.use(express.urlencoded({ extended: true })); // Para parsear bodies URL-encoded

// Ruta de prueba
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is healthy and running!' });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});