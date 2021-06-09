import type { Redis } from "ioredis";

interface RedisPrefixed {
  default: Redis;
  tracks: Redis;
  games: Redis;
  chatbotInput: Redis;
  chatbotResponse: Redis;
  ribbons: Redis;
}

interface RedisManager extends RedisPrefixed {}

export type { RedisPrefixed, RedisManager };
