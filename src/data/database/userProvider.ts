import { PrismaClient } from '.prisma/client';
import type { User } from 'discord.js';
import { Redis } from 'ioredis';
import { prisma } from '../prismaClient';
import { forRibbons, redis } from '../redisClient';

export class UserProvider {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly redis: Redis,
  ) {}

  async getRibbons(user: User) {
    const ping = await this.redis.get(forRibbons(user.id));
    if (ping) {
      this.redis.expire(forRibbons(user.id), 60);
      return parseInt(ping, 10);
    }
    return this.prisma.user
      .findUnique({
        where: { userId: user.id },
        select: { ribbons: true },
      })
      .then((res) => {
        const ribbons = res?.ribbons || 0;
        this.redis.set(forRibbons(user.id), ribbons, 'ex', 60);
        return ribbons;
      });
  }

  async incrRibbons(user: User, incrby: number) {
    if (incrby < 0) throw new Error('Got a negative value to increment.');
    return this.prisma.user
      .upsert({
        where: { userId: user.id },
        update: { ribbons: { increment: incrby } },
        create: { userId: user.id, tag: user.tag, ribbons: incrby },
      })
      .then((_user) => redis.set(forRibbons(user.id), _user.ribbons, 'ex', 60));
  }
}

export const userProvider = new UserProvider(prisma, redis);
