import Redis, { KeyType } from 'ioredis';

const withPrefix = (keyPrefix: string) =>
  new Redis(process.env.REDISCLOUD_URL, {
    keyPrefix: `${keyPrefix}:`,
  });

export const redis = new Redis(process.env.REDISCLOUD_URL);
export const redisQueue = withPrefix('queue');

export const forPrefix = (key: KeyType) => `prefix:${key}`;
export const forRibbons = (key: KeyType) => `ribbons:${key}`;
export const forBalloonMin = (key: KeyType) => `balloon:min:${key}`;
export const forBalloonMax = (key: KeyType) => `balloon:max:${key}`;
export const forShiritoriMinLen = (key: KeyType) => `shiritori:minlen:${key}`;
export const forShiritoriHand = (key: KeyType) => `shiritori:hand:${key}`;
export const forChikaInput = (key: KeyType) => `chika:input:${key}`;
export const forChikaResponse = (key: KeyType) => `chika:response:${key}`;
export const forCooldown = (key: KeyType) => `cooldown:${key}`;
