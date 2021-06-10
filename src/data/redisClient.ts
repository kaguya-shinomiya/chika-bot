import Redis from "ioredis";

const withPrefix = (keyPrefix: string) =>
  new Redis(process.env.REDISCLOUD_URL, {
    keyPrefix: `${keyPrefix}:`,
  });

export const redis = new Redis(process.env.REDISCLOUD_URL);
export const queue = withPrefix("queue");
export const chatbotInput = withPrefix("chatbotInput");
export const chatbotResponse = withPrefix("chatbotResponse");
export const ribbons = withPrefix("ribbons");
export const guildPrefix = withPrefix("prefix");
