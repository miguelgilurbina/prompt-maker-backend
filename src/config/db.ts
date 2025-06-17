// backend/src/config/db.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Asegurarse de que las variables de entorno estén cargadas

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.error('MONGO_URI no está definida en las variables de entorno.');
      process.exit(1); // Salir del proceso con error
    }

    console.log('Intentando conectar a MongoDB...');
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    mongoose.connection.on('connected', () => {
      console.log('Mongoose conectado a la base de datos');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Error de conexión de Mongoose:', err);
    });

    console.log('MongoDB Conectado Exitosamente.');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    process.exit(1); // Salir del proceso con error
  }
};

export default connectDB;
