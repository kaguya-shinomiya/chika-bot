import { PrismaClient } from '@prisma/client';
import type { Redis } from 'ioredis';
import {
  DEFAULT_SHIRITORI_HAND,
  DEFAULT_SHIRITORI_MIN_LEN,
} from '../../games/shiritori/utils/defaults';
import { prisma as prismaClient } from '../prismaClient';
import {
  forShiritoriHand,
  forShiritoriMinLen,
  redis,
  redis as redisClient,
} from '../redisClient';

export class ShiritoriProvider {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly redis: Redis,
  ) {}

  async setMinLen(guildId: string, minLen: number) {
    if (minLen < 0) throw new Error('Min length cannot be negative.');
    await this.prisma.guild
      .upsert({
        where: { guildId },
        update: {
          shiritori: {
            upsert: { update: { minLen }, create: { minLen } },
          },
        },
        create: {
          guildId,
          shiritori: { create: { minLen } },
        },
      })
      .then(() =>
        this.redis.set(forShiritoriMinLen(guildId), minLen, 'ex', 60),
      );
  }

  async getMinLen(guildId?: string) {
    if (!guildId) return DEFAULT_SHIRITORI_MIN_LEN;

    const ping = await redis.get(forShiritoriMinLen(guildId));
    if (ping) {
      this.redis.expire(forShiritoriMinLen(guildId), 60);
      return parseInt(ping, 10);
    }
    return this.prisma.shiritori
      .findUnique({
        where: { guildId },
        select: { minLen: true },
      })
      .then((res) => {
        const minLen = res?.minLen || DEFAULT_SHIRITORI_MIN_LEN;
        this.redis.set(forShiritoriMinLen(guildId), minLen, 'ex', 60);
        return minLen;
      });
  }

  async setHandSize(guildId: string, handSize: number) {
    if (handSize <= 0) throw new Error('Hand size must be at least one.');
    await this.prisma.guild
      .upsert({
        where: { guildId },
        update: {
          shiritori: {
            upsert: {
              update: { handSize },
              create: { handSize },
            },
          },
        },
        create: { guildId, shiritori: { create: { handSize } } },
      })
      .then(() => redis.set(forShiritoriHand(guildId), handSize, 'ex', 60));
  }

  async getHandSize(guildId: string) {
    const ping = await redis.get(forShiritoriHand(guildId));
    if (ping) {
      redis.expire(forShiritoriHand(guildId), 60);
      return parseInt(ping, 10);
    }
    return this.prisma.shiritori
      .findUnique({
        where: { guildId },
        select: { handSize: true },
      })
      .then((res) => {
        const handSize = res?.handSize || DEFAULT_SHIRITORI_HAND;
        redis.set(forShiritoriHand(guildId), handSize, 'ex', 60);
        return handSize;
      });
  }
}

export const shiritoriProvider = new ShiritoriProvider(
  prismaClient,
  redisClient,
);
