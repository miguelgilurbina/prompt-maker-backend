// backend/src/models/Category.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { PromptCategory as FrontendPromptCategoryType } from '../../../../prompt-maker/src/lib/types/category'; // Ajusta la ruta

// Queremos que los 'ids' de las categorías del backend coincidan con los del frontend
const validCategories: FrontendPromptCategoryType[] = [
  'creative-writing',
  'technical',
  'business',
  'academic',
  'general',
  'custom',
];

export interface ICategory extends Document {
  id: FrontendPromptCategoryType; // Usará los mismos valores que el frontend
  name: string; // Nombre legible para mostrar
  description?: string;
}

const CategorySchema: Schema<ICategory> = new Schema({
  id: {
    // Este 'id' es el valor string como 'creative-writing'
    type: String,
    required: true,
    unique: true,
    enum: validCategories, // Asegura que solo se puedan usar valores válidos
  },
  name: {
    // Nombre legible, e.g., "Creative Writing"
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
});
// Nota: Mongoose añade un _id automáticamente. Si queremos que el 'id'
// de nuestro esquema sea el _id, se puede configurar.
// Pero aquí, 'id' es nuestro identificador de categoría de negocio.

const Category = mongoose.model<ICategory>('Category', CategorySchema);
export default Category;
