// backend/src/models/Prompt.model.ts
import mongoose, { Schema, Document } from 'mongoose';
// Importar el tipo de categoría del frontend para consistencia
import { Prompt } from '../../../shared/src/types/prompt.types'; // Ajusta la ruta
import { PromptVariable } from '../../../shared/src/types/prompt.types';

export interface IPrompt extends Document, Omit<Prompt, 'id' | 'categoryId'> {
  userId: mongoose.Types.ObjectId;
  categoryId?: mongoose.Types.ObjectId;
  isPublic: boolean;
  variables: PromptVariable[];
}

const PromptVariableSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    defaultValue: { type: Schema.Types.Mixed },
    type: { type: String, enum: ['text', 'number', 'select'], default: 'text' },
    options: [String], // Para variables de tipo 'select'
  },
  { _id: false }
);

const PromptSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    description: { type: String },
    variables: [PromptVariableSchema],
    tags: [String],
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IPrompt>('Prompt', PromptSchema);
