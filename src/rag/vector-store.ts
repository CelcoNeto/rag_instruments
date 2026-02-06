type DocumentVetorial = {
  text: string;
  embedding: number[];
};

const store: DocumentVetorial[] = [];

export const addDocument = (doc: DocumentVetorial) => {
  store.push(doc);
};

export const cosineSimilarity = (a: number[], b: number[]) => {
  const dot = a.reduce((sum, v, i) => sum + v * (b[i] ?? 0), 0);
  const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  return dot / (magA * magB);
};

export const findSimilarity = (embedding: number[], topK = 2) => {
  return store
    .map((doc) => ({
      text: doc.text,
      score: cosineSimilarity(embedding, doc.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
};
