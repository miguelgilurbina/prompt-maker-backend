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

    await mongoose.connect(mongoURI);
    // Opciones adicionales que Mongoose solía requerir ya no son necesarias en v6+
    // como useNewUrlParser, useUnifiedTopology, useCreateIndex, useFindAndModify.
    // Mongoose v6+ las maneja internamente.

    console.log('MongoDB Conectado Exitosamente.');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    process.exit(1); // Salir del proceso con error
  }
};

export default connectDB;
