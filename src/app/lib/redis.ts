import { createClient } from "redis";
import config from "../config";

export const redisClient = createClient({
  username: config.redis_user,
  password: config.redis_password,
  socket: {
    host: config.redis_host,
    port: Number(config.redis_port),

    // Retry Redis connection when the connection is lost
    reconnectStrategy: (retries) => {
      const delay = Math.min((retries + 1) * 500, 5000);

      console.log(
        `Redis reconnecting... attempt ${retries + 1}, retrying in ${delay}ms`,
      );

      return delay;
    },
  },
});

// Handle Redis connection errors
redisClient.on("error", (error) => {
  console.error("Redis Client Error:", error);
});

// Log when Redis connects
redisClient.on("connect", () => {
  console.log("Redis socket connected");
});

// Log when Redis becomes ready
redisClient.on("ready", () => {
  console.log("Redis client ready");
});

// Log when Redis connection closes
redisClient.on("end", () => {
  console.log("Redis connection closed");
});
