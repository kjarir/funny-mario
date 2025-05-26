import { Document } from 'langchain/document';
import { pipeline } from '@xenova/transformers';

let model: any = null;

export async function buildIndex(documents: Document[]) {
  try {
    if (!model) {
      model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
  } catch (error) {
    alert('Failed to load the AI model. Please check your internet connection or try again later.');
    throw error;
  }

  const texts = documents.map(doc => doc.pageContent);
  const embeddings = await Promise.all(
    texts.map(async (text) => {
      const result = await model(text, { pooling: 'mean', normalize: true });
      return Array.from(result.data);
    })
  );
  
  return { embeddings, texts };
}

export async function searchSimilar(embeddings: number[][], texts: string[], query: string, k: number = 1) {
  if (!model) {
    model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }

  const queryEmbedding = await model(query, { pooling: 'mean', normalize: true });
  const queryVector = Array.from(queryEmbedding.data) as number[];

  // Calculate cosine similarity
  const similarities = embeddings.map((embedding, index) => {
    const similarity = cosineSimilarity(queryVector, embedding as number[]);
    return { index, similarity };
  });

  // Sort by similarity and get top k
  similarities.sort((a, b) => b.similarity - a.similarity);
  const topK = similarities.slice(0, k);

  return {
    distances: topK.map(item => 1 - item.similarity), // Convert similarity to distance
    indices: topK.map(item => item.index),
    texts: topK.map(item => texts[item.index])
  };
}

// Helper function to calculate cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
} 