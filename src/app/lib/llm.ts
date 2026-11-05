import { RunnableLambda } from "@langchain/core/runnables";
import config from "../config";
import { ChatOpenAI } from "@langchain/openai";
import { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import { Embeddings, type EmbeddingsParams } from "@langchain/core/embeddings";

const OPENROUTER = config.openrouter_base_url;

const fallbackChatModels = (config.openrouter_fallback_chat_models ?? "")
  .split(",")
  .map((model) => model.trim())
  .filter(Boolean);

const openRouterChatModel = new ChatOpenAI({
  model: config.openrouter_chat_model,
  apiKey: config.openrouter_api_key,
  temperature: 0.2,

  modelKwargs: {
    models: [config.openrouter_chat_model, ...fallbackChatModels],
  },

  configuration: {
    baseURL: OPENROUTER,
    defaultHeaders: {
      "HTTO-Referer": config.frontend_url ?? "http://localhost:3000",
      "X-Title": "PH Healthcare",
    },
  },
});

export const chatModel = RunnableLambda.from(
  async (input: BaseLanguageModelInput, options) => {
    try {
      return await openRouterChatModel.invoke(input, options);
    } catch (error) {
      throw error instanceof TypeError
        ? new Error(`OpenRouter returned no completion: ${error.message}`)
        : error;
    }
  },
).withRetry({ stopAfterAttempt: 3 });

// OpenRouter Embedding API Response Type
type TOpenRouterEmbeddingResponse = {
  data: {
    embedding: number[];
    index: number;
  }[];
};

class OpenRouterEmbeddings extends Embeddings {
  private readonly model: string;
  private readonly apiKey: string;

  constructor(model: string, apiKey: string, params: EmbeddingsParams = {}) {
    super(params);

    this.model = model;
    this.apiKey = apiKey;
  }

  private async embed(input: string[]): Promise<number[][]> {
    const baseUrl = process.env.OPENROUTER_BASE_URL;

    if (!baseUrl) {
      throw new Error("OPENROUTER_BASE_URL is not configured.");
    }

    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/embeddings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        input,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `OpenRouter embeddings failed: ${response.status} ${await response.text()}`,
      );
    }

    const result = (await response.json()) as TOpenRouterEmbeddingResponse;

    return result.data
      .sort((a, b) => a.index - b.index)
      .map((item) => item.embedding);
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    return this.caller.call(() => this.embed(texts));
  }

  async embedQuery(text: string): Promise<number[]> {
    const [vector] = await this.caller.call(() => this.embed([text]));

    if (!vector) {
      throw new Error("OpenRouter returned an empty embedding.");
    }

    return vector;
  }
}

export const embeddings = new OpenRouterEmbeddings(
  config.openrouter_embeding_model,
  config.openrouter_api_key,
  {
    maxRetries: 3,
  },
);
