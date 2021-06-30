import { PrismaClient } from '.prisma/client';
import { Redis } from 'ioredis';
import {
  DEFAULT_MAX_BALLOON,
  DEFAULT_MIN_BALLOON,
} from '../../games/balloon/utils/defaults';
import { prisma as prismaClient } from '../prismaClient';
import {
  forBalloonMax,
  forBalloonMin,
  redis as redisClient,
} from '../redisClient';

export class BalloonProvider {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly redis: Redis,
  ) {}

  async setBalloonMin(minVol: number, guildId: string) {
    // validation to be done in app code
    if (minVol < 0) throw new Error('Received negative volume.');
    await this.prisma.guild
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
        this.redis.set(forBalloonMin(guildId), minVol, 'ex', 60);
      });
  }

  async getBalloonMin(guildId: string) {
    const ping = await this.redis.get(forBalloonMin(guildId));
    if (ping) {
      this.redis.expire(forBalloonMin(guildId), 60);
      return parseInt(ping, 10);
    }
    return this.prisma.balloon
      .findUnique({
        where: { guildId },
        select: { minVol: true },
      })
      .then((res) => {
        const minVol = res?.minVol || DEFAULT_MIN_BALLOON;
        this.redis.set(forBalloonMin(guildId), minVol, 'ex', 60);
        return minVol;
      });
  }

  async setBalloonMax(maxVol: number, guildId: string) {
    // validation to be done in app code
    if (maxVol < 0) throw new Error('Received negative volume.');
    await this.prisma.guild
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
        this.redis.set(forBalloonMax(guildId), maxVol, 'ex', 60);
      });
  }

  async getBalloonMax(guildId: string) {
    const ping = await this.redis.get(forBalloonMax(guildId));
    if (ping) {
      this.redis.expire(forBalloonMax(guildId), 60);
      return parseInt(ping, 10);
    }
    return this.prisma.balloon
      .findUnique({
        where: { guildId },
        select: { maxVol: true },
      })
      .then((res) => {
        const maxVol = res?.maxVol || DEFAULT_MAX_BALLOON;
        this.redis.set(forBalloonMax(guildId), maxVol, 'ex', 60);
        return maxVol;
      });
  }
}

export const balloonProvider = new BalloonProvider(prismaClient, redisClient);
