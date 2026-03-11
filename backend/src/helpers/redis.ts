import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL,
  disableOfflineQueue: true,
  pingInterval: 1000 * 60 * 3,

  socket: {
    keepAlive: true,

    ...(process.env.REDIS_URL?.startsWith("rediss://")
      ? { tls: true, rejectUnauthorized: false }
      : {}),

    reconnectStrategy: (retries: number) => {
      console.log(`Redis reconnecting... attempt ${retries}`);
      return Math.min(retries * 1000, 5000);
    }
  }
});


redisClient.on("connect", () => {
  console.log("Redis connecting...");
});

redisClient.on("ready", () => {
  console.log("Redis ready!");
});

redisClient.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});

redisClient.on("end", () => {
  console.log("Redis connection closed");
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("Connected to Redis!");
    }
  } catch (error) {
    console.error("Failed to connect to Redis", error);
  }
};