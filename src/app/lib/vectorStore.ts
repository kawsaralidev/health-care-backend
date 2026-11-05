import pg from "pg";
import config from "../config";
import { PGVectorStore } from "@langchain/pgvector";
import { embeddings } from "../lib/llm";

// PostgreSQL Connection Pool
const vectorPool = new pg.Pool({
  connectionString: config.database_url,
  idleTimeoutMillis: 10_000,
  keepAlive: true,
});

// Database Connection Error Handler
vectorPool.on("error", (error) => {
  console.error("Vector store: idle database connection error", error.message);
});

// PostgreSQL Vector Store
export const vectorStore = new PGVectorStore(embeddings, {
  pool: vectorPool,
  tableName: "doctor_embeddings",
  columns: {
    idColumnName: "id",
    vectorColumnName: "embedding",
    contentColumnName: "content",
    metadataColumnName: "metadata",
  },
  distanceStrategy: "cosine",
});
