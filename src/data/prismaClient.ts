import { PrismaClient } from '@prisma/client';
import {
  DEFAULT_MAX_BALLOON,
  DEFAULT_MIN_BALLOON,
} from '../games/balloon/utils/defaults';
import {
  DEFAULT_SHIRITORI_HAND,
  DEFAULT_SHIRITORI_MIN_LEN,
} from '../games/shiritori/utils/defaults';
import {
  forBalloonMax,
  forBalloonMin,
  forShiritoriHand,
  forShiritoriMinLen,
  redis,
} from './redisClient';

export class ChikaPrisma extends PrismaClient {
  async setBalloonMin(minVol: number, guildId: string) {
    // validation to be done in app code
    await this.guild
      .upsert({
        where: { guildId },
        update: {
          balloon: {
            upsert: { update: { minVol }, create: { minVol } },
          },
        },
        create: {
          guildId,
          balloon: {
            connectOrCreate: { create: { minVol }, where: { guildId } },
          },
        },
      })
      .then(() => {
        redis.set(forBalloonMin(guildId), minVol, 'ex', 60);
      });
  }

  async getBalloonMin(guildId: string) {
    const ping = await redis.get(forBalloonMin(guildId));
    if (ping) {
      redis.expire(forBalloonMin(guildId), 60);
      return parseInt(ping, 10);
    }
    return this.balloon
      .findUnique({
        where: { guildId },
        select: { minVol: true },
      })
      .then((res) => {
        const minVol = res?.minVol || DEFAULT_MIN_BALLOON;
        redis.set(forBalloonMin(guildId), minVol, 'ex', 60);
        return minVol;
      });
  }

  async setBalloonMax(maxVol: number, guildId: string) {
    // validation to be done in app code
    await this.guild
      .upsert({
        where: { guildId },
        update: {
          balloon: {
            upsert: { update: { maxVol }, create: { maxVol } },
          },
        },
        create: {
          guildId,
          balloon: {
            create: { maxVol },
          },
        },
      })
      .then(() => {
        redis.set(forBalloonMax(guildId), maxVol, 'ex', 60);
      });
  }

  async getBalloonMax(guildId: string) {
    const ping = await redis.get(forBalloonMax(guildId));
    if (ping) {
      redis.expire(forBalloonMax(guildId), 60);
      return parseInt(ping, 10);
    }
    return this.balloon
      .findUnique({
        where: { guildId },
        select: { maxVol: true },
      })
      .then((res) => {
        const maxVol = res?.maxVol || DEFAULT_MAX_BALLOON;
        redis.set(forBalloonMax(guildId), maxVol, 'ex', 60);
        return maxVol;
      });
  }

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
