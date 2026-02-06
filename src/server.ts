import "dotenv/config"
import Fastify from "fastify";
import cors from "@fastify/cors";
import { INSTRUMENTS_LIST } from "./data/instruments.js";
import { generateEmbedding } from "./rag/embedding.js";
import { addDocument } from "./rag/vector-store.js";
import { answerQuestion } from "./rag/service.js";

const app = Fastify();
await app.register(cors);

const loadBase = async () => {
  for (const instrument of INSTRUMENTS_LIST) {
    const embedding = await generateEmbedding(instrument.texto);
    if (embedding) addDocument({ text: instrument.texto, embedding });
  }
};

app.post("/chat", async (req: any, reply) => {
  try {
    console.log("req.body", req.body);
    const response = await answerQuestion(req.body.question);
    return { response };
  } catch (error: any) {
    console.error("Error in /chat:", error);
    return reply.status(500).send({
      error: error.message || "Internal server error",
      details: error.stack
    });
  }
});

loadBase();

app.listen({ port: 3000 }, () =>
  console.log("🚀 RAG rodando em http://localhost:3000"),
);
