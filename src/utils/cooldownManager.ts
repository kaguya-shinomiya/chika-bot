import type { Snowflake } from "discord.js";
import Redis from "ioredis";

const cooldownRedis = new Redis(process.env.REDISCLOUD_URL, {
  keyPrefix: "cooldown:",
});

export const setCooldown = (id: Snowflake, command: string, time: number) =>
  cooldownRedis.set(`${id}${command}`, command, "px", time);
export const getCooldown = async (id: Snowflake, command: string) => {
  const ttl = await cooldownRedis.ttl(`${id}${command}`);
  if (ttl <= 0) {
    return 0;
  }
  return ttl;
};
