// backend/src/models/Prompt.model.ts
import mongoose, { Schema, Document, Types } from 'mongoose';
// Importar el tipo de categoría del frontend para consistencia
import { PromptCategory as FrontendPromptCategoryType } from '../../../frontend/src/lib/types/prompt'; // Ajusta la ruta

const validCategories: FrontendPromptCategoryType[] = [
  'creative-writing',
  'technical',
  'business',
  'academic',
  'general',
  'custom',
];

// Interfaz para las variables del Prompt
export interface IPromptVariable {
  // Mongoose no necesita un _id para subdocumentos a menos que lo queramos explícitamente como ObjectId
  // id: string; // Este 'id' era para el frontend, en el backend Mongoose maneja _id para subdocs si es un array de Schemas.
  // Si queremos un 'id' de negocio, podemos añadirlo. Por ahora, usaremos el 'name' como identificador único dentro del prompt.
  name: string;
  description?: string;
  defaultValue?: string;
  type: 'text' | 'number' | 'select' | 'multiline';
  options?: string[];
}

// Esquema para las variables del Prompt (será un array de estos)
const PromptVariableSchema: Schema<IPromptVariable> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    defaultValue: { type: String, trim: true },
    type: {
      type: String,
      required: true,
      enum: ['text', 'number', 'select', 'multiline'],
    },
    options: [{ type: String }], // Array de strings para las opciones de 'select'
  },
  { _id: false }
); // _id: false para que Mongoose no añada _id a cada variable

export interface IPrompt extends Document {
  title: string;
  description?: string;
  content: string;
  tags: string[];
  category: FrontendPromptCategoryType; // Tipo de categoría del frontend
  variables: IPromptVariable[];
  isTemplate?: boolean;
  userId: Types.ObjectId; // Referencia al usuario que creó el prompt
  // Futuro: isPublic, version, etc.
  createdAt: Date;
  updatedAt: Date;
}

const PromptSchema: Schema<IPrompt> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio.'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'El contenido del prompt es obligatorio.'],
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    category: {
      type: String,
      required: true,
      enum: validCategories, // Usa los mismos valores que el frontend
    },
    variables: [PromptVariableSchema], // Array de subdocumentos
    isTemplate: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId, // Tipo especial para IDs de Mongoose
      ref: 'User', // Referencia al modelo 'User'
      required: true,
      index: true, // Buen candidato para un índice si buscas prompts por usuario
    },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt
  }
);

const Prompt = mongoose.model<IPrompt>('Prompt', PromptSchema);
export default Prompt;
