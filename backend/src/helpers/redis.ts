import { createClient } from 'redis';

export const redisClient = createClient({
  url: process.env.REDIS_URL,
  pingInterval: 1000 * 60 * 3, // กำหนดเวลาให้มัน ping ทุกๆ 3 นาที กันมันตัดการเชื่อมต่อกัน
  socket: {
    ...(process.env.REDIS_URL?.startsWith('rediss://') ? { tls: true, rejectUnauthorized: false } : {}),
    reconnectStrategy: (retries) => {
      console.log(`Reconnecting to Redis... Attempt ${retries}`);
      return Math.min(retries * 1000, 5000); // ตั้งเวลาให้มัน reconnect ทุกๆ 1-5วิ
    }
  }
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis!');
  } catch (error) {
    console.error('Failed to connect to Redis', error);
  }
};
