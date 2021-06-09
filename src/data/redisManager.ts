import Redis from "ioredis";

export const redis = new Redis(process.env.REDISCLOUD_URL);
export const queue = new Redis(process.env.REDISCLOUD_URL, {
  keyPrefix: "queue:",
});
export const chatbotInput = new Redis(process.env.REDISCLOUD_URL, {
  keyPrefix: "chatbotInput:",
});
export const chatbotResponse = new Redis(process.env.REDISCLOUD_URL, {
  keyPrefix: "chatbotResponse:",
});
export const ribbons = new Redis(process.env.REDISCLOUD_URL, {
  keyPrefix: "ribbons:",
});
