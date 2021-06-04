import { KeyType, Redis } from "ioredis";

export const pingRedis = async (redis: Redis, key: KeyType) => redis.get(key);
