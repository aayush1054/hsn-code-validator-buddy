
import { sampleDocuments } from './sampleDocuments';
import { VectorStore } from './vectorStore';

export function preloadSampleDocuments(vectorStore: VectorStore): void {
  sampleDocuments.forEach(document => {
    vectorStore.addDocument(document);
  });
}
