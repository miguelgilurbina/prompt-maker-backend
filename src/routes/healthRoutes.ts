
// Crear archivo en: backend/src/routes/health.ts
import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

interface HealthCheckResponse {
  status: string;
  timestamp: string;
  database: string;
  environment: string;
  mongoUri?: string; // Solo en desarrollo
}

router.get('/health', async (req: Request, res: Response) => {
  try {
    // Verificar conexión a MongoDB
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    const response: HealthCheckResponse = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      environment: process.env.NODE_ENV || 'development'
    };

    // En desarrollo, incluir info adicional
    if (process.env.NODE_ENV !== 'production') {
      response.mongoUri = process.env.MONGODB_URI ? 'configured' : 'not configured';
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;