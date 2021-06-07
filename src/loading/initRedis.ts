import Redis from "ioredis";
import { RedisPrefixed } from "../types/redis";

export const initRedis = (): RedisPrefixed => ({
  defaultRedis: new Redis(process.env.REDISCLOUD_URL),
  tracksRedis: new Redis(process.env.REDISCLOUD_URL, {
    keyPrefix: "tracks:",
  }),
  gamesRedis: new Redis(process.env.REDISCLOUD_URL, {
    keyPrefix: "game:",
  }),
  chatbotInputRedis: new Redis(process.env.REDISCLOUD_URL, {
    keyPrefix: "chatbotInput:",
  }),
  chatbotResponseRedis: new Redis(process.env.REDISCLOUD_URL, {
    keyPrefix: "chatbotResponse:",
  }),
});
