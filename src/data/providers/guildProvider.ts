import { PrismaClient } from '.prisma/client';
import { Snowflake } from 'discord.js';
import { Redis } from 'ioredis';
import { DEFAULT_PREFIX } from '../../shared/constants';
import { prisma } from '../prismaClient';
import { forBlockedCommands, forPrefix, redis } from '../redisClient';

export class GuildProvider {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly redis: Redis,
  ) {}

  async getPrefix(guildId: Snowflake) {
    const ping = await this.redis.get(forPrefix(guildId));
    if (ping) {
      this.redis.expire(forPrefix(guildId), 60);
      return ping;
    }
    return this.prisma.guild
      .findUnique({
        where: { guildId },
        select: { prefix: true },
      })
      .then((res) => {
        let prefix = res?.prefix;
        if (!prefix) prefix = DEFAULT_PREFIX;
        this.redis.set(forPrefix(guildId), prefix, 'ex', 60);
        return prefix;
      });
  }

  async setPrefix(guildId: Snowflake, prefix: string) {
    redis.set(forPrefix(guildId), prefix, 'ex', 60);

    await this.prisma.guild.upsert({
      create: { guildId, prefix },
      update: { prefix },
      where: { guildId },
    });
  }

  async getBlockedCommands(guildId: Snowflake): Promise<string[]> {
    // just store the command name in redis
    const ping = await this.redis.lrange(forBlockedCommands(guildId), 0, -1);
    if (ping?.length) {
      this.redis.expire(forBlockedCommands(guildId), 60);
      return ping;
    }
    return this.prisma.guild
      .findUnique({
        where: { guildId },
        select: { disabledCommands: { select: { name: true } } },
      })
      .then((res) => {
        if (!res?.disabledCommands?.length) return [];
        return res.disabledCommands.map(({ name }) => name);
      });
  }
}

export const guildProvider = new GuildProvider(prisma, redis);
