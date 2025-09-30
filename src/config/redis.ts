import { createClient } from "redis";
import pino from "pino";

const logger = pino({ name: "redis" });

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on("connect", () => logger.info("Redis client connected"));
redisClient.on("error", (err) => logger.error({ err }, "Redis error"));

(async () => {
  await redisClient.connect();
})();

export default redisClient;
