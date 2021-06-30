import { PrismaClient } from '@prisma/client';
import {
  DEFAULT_SHIRITORI_HAND,
  DEFAULT_SHIRITORI_MIN_LEN,
} from '../games/shiritori/utils/defaults';
import { forShiritoriHand, forShiritoriMinLen, redis } from './redisClient';

export class ChikaPrisma extends PrismaClient {
  async setShiritoriMinLen(guildId: string, minLen: number) {
    await this.guild
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
      .then(() => redis.set(forShiritoriMinLen(guildId), minLen, 'ex', 60));
  }

  async getShiritoriMinLen(guildId: string | undefined) {
    if (!guildId) return DEFAULT_SHIRITORI_MIN_LEN;

    const ping = await redis.get(forShiritoriMinLen(guildId));
    if (ping) {
      redis.expire(forShiritoriMinLen(guildId), 60);
      return parseInt(ping, 10);
    }
    return this.shiritori
      .findUnique({
        where: { guildId },
        select: { minLen: true },
      })
      .then((res) => {
        const minLen = res?.minLen || DEFAULT_SHIRITORI_MIN_LEN;
        redis.set(forShiritoriMinLen(guildId), minLen, 'ex', 60);
        return minLen;
      });
  }

  async setShiritoriHandSize(guildId: string, handSize: number) {
    await this.guild
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

  async getShiritoriHandSize(guildId: string) {
    const ping = await redis.get(forShiritoriHand(guildId));
    if (ping) {
      redis.expire(forShiritoriHand(guildId), 60);
      return parseInt(ping, 10);
    }
    return this.shiritori
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

export const prisma = new ChikaPrisma();
