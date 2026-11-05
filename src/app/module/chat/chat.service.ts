import { redisClient } from "../../lib/redis";

const TOP_K_DOCTORS = 4;
const MAX_HISTORY_MESSAGE = 10;
const HISTORY_TTL_SECONDS = 60 * 60;

type TStoreMessage = {
  role: "human" | "ai";
  content: string;
};

const historyKey = (sessionId: string) => `chat:session:${sessionId}`;

const getHistory = async (sessionId: string): Promise<TStoreMessage[]> => {
  const raw = await redisClient.get(historyKey(sessionId));

  return raw ? (JSON.parse(raw) as TStoreMessage[]) : [];
};

const saveHistory = async (sessionId: string, history: TStoreMessage[]) => {
  await redisClient.set(
    historyKey(sessionId),
    JSON.stringify(history.slice(-MAX_HISTORY_MESSAGE)),
    {
      expiration: {
        type: "EX",
        value: HISTORY_TTL_SECONDS,
      },
    },
  );
};
