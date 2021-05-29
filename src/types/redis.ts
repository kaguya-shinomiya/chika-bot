import { Redis } from "ioredis";

export interface RedisPrefixed {
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
