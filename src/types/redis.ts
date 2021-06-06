import type { Redis } from "ioredis";

interface RedisPrefixed {
  defaultRedis: Redis;
  tracksRedis: Redis;
  gamesRedis: Redis;
}

// eslint-disable-next-line no-shadow
export enum RedisPrefix {
  default = 1,
  tracks,
  games,
}

export type { RedisPrefixed };
