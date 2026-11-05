import { createClient } from "redis";
import config from "../config";

export const redisClient = createClient({
  username: config.redis_user,
  password: config.redis_password,

  socket: {
    host: config.redis_host,
    port: Number(config.redis_port),

    connectTimeout: 15000,

    // Reconnect with exponential backoff
    reconnectStrategy: (retries) => {
      if (retries > 20) {
        console.error("Redis maximum retry attempts reached.");
        return new Error("Redis connection failed after 20 attempts");
      }

      const delay = Math.min(500 * 2 ** retries, 15000);

      console.log(
        `Redis reconnecting... attempt ${retries + 1}, retrying in ${delay}ms`,
      );

      return delay;
    },
  },
});

// Redis error handler
redisClient.on("error", (error) => {
  console.error("Redis Client Error:", error.message);
});

// Redis connection events
redisClient.on("connect", () => {
  console.log("Redis socket connected");
});

redisClient.on("ready", () => {
  console.log("Redis client ready");
});

redisClient.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});

redisClient.on("end", () => {
  console.log("Redis connection closed");
});
