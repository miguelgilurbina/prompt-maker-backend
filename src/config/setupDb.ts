// backend/src/config/setupDb.ts
import mongoose from 'mongoose';
import Prompt from '../models/Prompt.model';

export async function setupIndexes() {
  try {
    console.log("Configurando índices en MongoDB...");
    
    // Índice para búsqueda de texto
    await Prompt.collection.createIndex(
      { title: "text", content: "text", tags: "text" },
      { name: "prompt_text_search" }
    );
    
    // Índice para ordenar por votos
    await Prompt.collection.createIndex(
      { votes: -1 },
      { name: "prompt_votes" }
    );
    
    console.log("Índices de MongoDB configurados correctamente");
  } catch (error) {
    console.error("Error configurando índices:", error);
  }
}