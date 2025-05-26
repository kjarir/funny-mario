import { loadPDFs } from './pdf_reader';
import { buildIndex } from './retriever';

declare global {
  interface Window {
    embeddings: number[][];
    texts: string[];
  }
}

export async function initializePDFIndex() {
  try {
    // Use import.meta.env for Vite/React environment variables
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5050';
    const response = await fetch(`${backendUrl}/api/pdf-index`);
    if (!response.ok) {
      alert('Failed to fetch PDF index from backend.');
      return;
    }
    const { embeddings, texts } = await response.json();

    window.embeddings = embeddings as number[][];
    window.texts = texts;

    console.log('PDF index initialized successfully');
  } catch (error) {
    console.error('Error initializing PDF index:', error);
  }
} 