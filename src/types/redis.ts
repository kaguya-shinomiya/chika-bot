import type { Redis } from "ioredis";

interface RedisPrefixed {
  defaultRedis: Redis;
  tracksRedis: Redis;
  gamesRedis: Redis;
  chatbotInputRedis: Redis;
  chatbotResponseRedis: Redis;
}

export type { RedisPrefixed };
