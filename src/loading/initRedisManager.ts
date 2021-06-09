import Redis from "ioredis";
import { RedisManager } from "../types/redis";

export const initRedis = (): RedisManager => ({
  default: new Redis(process.env.REDISCLOUD_URL),
  tracks: new Redis(process.env.REDISCLOUD_URL, {
    keyPrefix: "tracks:",
  }),
  chatbotInput: new Redis(process.env.REDISCLOUD_URL, {
    keyPrefix: "chatbotInput:",
  }),
  chatbotResponse: new Redis(process.env.REDISCLOUD_URL, {
    keyPrefix: "chatbotResponse:",
  }),
  ribbons: new Redis(process.env.REDISCLOUD_URL, {
    keyPrefix: "ribbons:",
  }),
});
