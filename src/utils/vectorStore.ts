
import { useState } from 'react';

// Document interface
export interface Document {
  id: string;
  text: string;
  metadata: {
    title: string;
    source: string;
  };
}

// Chunk interface
export interface Chunk {
  id: string;
  text: string;
  metadata: {
    title: string;
    source: string;
    chunkIndex: number;
  };
  embedding?: number[];
}

// Simple in-memory vector store
export class VectorStore {
  private documents: Document[] = [];
  private chunks: Chunk[] = [];
  private embeddings: Map<string, number[]> = new Map();

  // Add a document to the store
  addDocument(document: Document): void {
    this.documents.push(document);
    
    // Simple chunking by paragraphs (in a real app, you'd use a more sophisticated chunking strategy)
    const paragraphs = document.text.split('\n\n').filter(p => p.trim().length > 0);
    
    paragraphs.forEach((paragraph, index) => {
      const chunk: Chunk = {
        id: `${document.id}_chunk_${index}`,
        text: paragraph,
        metadata: {
          title: document.metadata.title,
          source: document.metadata.source,
          chunkIndex: index
        }
      };
      
      this.chunks.push(chunk);
      this.generateEmbedding(chunk);
    });
  }

  // Simple mock embedding generation - in a real app, you'd call an API like OpenAI or use a local model
  private generateEmbedding(chunk: Chunk): void {
    // This is a mock embedding generator that creates a random embedding vector
    // In a real application, you would use a proper embedding model
    const dimension = 384; // Common embedding dimension
    const embedding = Array.from({ length: dimension }, () => Math.random() * 2 - 1);
    this.embeddings.set(chunk.id, embedding);
    chunk.embedding = embedding;
  }

  // Get all documents
  getDocuments(): Document[] {
    return this.documents;
  }

  // Get all chunks
  getChunks(): Chunk[] {
    return this.chunks;
  }

  // Simple vector similarity calculation (cosine similarity)
  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) {
      throw new Error('Vectors must have the same dimension');
    }
    
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;
    
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      mag1 += vec1[i] * vec1[i];
      mag2 += vec2[i] * vec2[i];
    }
    
    mag1 = Math.sqrt(mag1);
    mag2 = Math.sqrt(mag2);
    
    return dotProduct / (mag1 * mag2);
  }

  // Search for similar chunks given a query
  search(query: string, topK: number = 3): Chunk[] {
    // Generate a mock embedding for the query
    const queryEmbedding = Array.from({ length: 384 }, () => Math.random() * 2 - 1);
    
    // Calculate similarity between query and all chunks
    const similarities = this.chunks.map(chunk => {
      const chunkEmbedding = this.embeddings.get(chunk.id);
      if (!chunkEmbedding) return { chunk, score: 0 };
      
      const score = this.cosineSimilarity(queryEmbedding, chunkEmbedding);
      return { chunk, score };
    });
    
    // Sort by similarity score and return the top K chunks
    return similarities
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(item => item.chunk);
  }
}

// Hook for using vector store
export function useVectorStore() {
  const [vectorStore] = useState(() => new VectorStore());
  
  return vectorStore;
}
