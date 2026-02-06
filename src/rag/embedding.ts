import OpenAI from "openai";
import { featureExtraction } from "@huggingface/inference";


const HF_EMBED_MODEL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2";

export const generateEmbedding = async (text: string): Promise<number[] | undefined> => {
  const token = process.env.HUGGINGFACE_TOKEN
  if (!token) throw new Error("Set HUGGINGFACE_TOKEN or HF_TOKEN in .env (free at https://huggingface.co/settings/tokens)");
  const result = await featureExtraction({
    accessToken: token,
    model: HF_EMBED_MODEL,
    inputs: text,
    provider: "hf-inference",
  });

  // Handle different response formats
  if (Array.isArray(result)) {
    // If result is number[][], get first vector
    if (result.length > 0 && Array.isArray(result[0])) {
      return result[0] as number[];
    }
    // If result is number[], return it directly
    if (result.length > 0 && typeof result[0] === 'number') {
      return result as number[];
    }
  }
  
  console.error("Unexpected embedding format:", typeof result, Array.isArray(result));
  return undefined;
};


export const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});
