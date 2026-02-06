import { generateEmbedding, openai } from "./embedding.js";
import { findSimilarity } from "./vector-store.js";

export const answerQuestion = async (question: string) => {
  const embeddingQuestion = await generateEmbedding(question);
  if (!embeddingQuestion) {
    throw new Error("Failed to generate embedding for question");
  }
  const documents = findSimilarity(embeddingQuestion);

  const context = documents.map((doc: { text: string; score: number }) => doc.text).join("\n");

  const completion = await openai.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: "Você é um especialista em instrumentos musicais.",
      },
      {
        role: "user",
        content: `Contexto: \n${context}\n\nPergunta:${question}`,
      },
    ],
  });
  return completion.choices[0]?.message.content;
};
