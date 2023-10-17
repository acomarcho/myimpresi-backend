import { createClient } from "redis";

export const redisClient = createClient();

(async () => {
  await redisClient.connect();
})();
