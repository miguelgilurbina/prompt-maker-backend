// backend/src/models/Category.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { PromptCategory } from '../../../shared/src/types/prompt.types'; // Ajusta la ruta

// Queremos que los 'ids' de las categorías del backend coincidan con los del frontend
// const validCategories: FrontendPromptCategoryType[] = [
//   'creative-writing',
//   'technical',
//   'business',
//   'academic',
//   'general',
//   'custom',
// ];

export interface ICategory extends Document, Omit<PromptCategory, 'id'> {}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});
// Nota: Mongoose añade un _id automáticamente. Si queremos que el 'id'
// de nuestro esquema sea el _id, se puede configurar.
// Pero aquí, 'id' es nuestro identificador de categoría de negocio.

export default mongoose.model<ICategory>('Category', CategorySchema);
