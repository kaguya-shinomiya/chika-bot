import Redis, { KeyType } from 'ioredis';

const withPrefix = (keyPrefix: string) =>
  new Redis(process.env.REDISCLOUD_URL, {
    keyPrefix: `${keyPrefix}:`,
  });

export const redis = new Redis(process.env.REDISCLOUD_URL);
export const redisQueue = withPrefix('queue');
export const redisChatbotInput = withPrefix('chatbot:input');
export const redisChatbotResponse = withPrefix('chatbot:response');
export const redisRibbons = withPrefix('ribbons');
export const redisGuildPrefix = withPrefix('prefix');
export const redisBalloonMin = withPrefix('balloon:min');
export const redisBalloonMax = withPrefix('balloon:max');
export const redisShiritoriMinLen = withPrefix('shiritori:minlen');

export const forPrefix = (key: KeyType) => `prefix:${key}`;
