import { PrismaClient } from '.prisma/client';
import type { User } from 'discord.js';
import { Redis } from 'ioredis';
import { prisma as prismaClient } from '../prismaClient';
import { forRibbons, redis as redisClient } from '../redisClient';

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
      .then((_user) =>
        this.redis.set(forRibbons(user.id), _user.ribbons, 'ex', 60),
      );
  }

  async decrRibbons(user: User, decrby: number) {
    if (decrby < 0) throw new Error('Received negative decrby value.');
    await this.prisma
      .$transaction([
        this.prisma.$executeRaw<number>`
        INSERT INTO "User" ("userId", tag, ribbons)
        VALUES (${user.id}, ${user.tag}, ${0})
        ON CONFLICT ("userId") DO UPDATE
        SET ribbons =
          CASE
            WHEN "User".ribbons < ${decrby} THEN ${0}
            ELSE "User".ribbons - ${decrby}
          END;`,
        this.prisma.user.findUnique({
          where: { userId: user.id },
          select: { ribbons: true },
        }),
      ])
      .then((_res) => {
        const [, res] = _res;
        const ribbons = res?.ribbons || 0;
        this.redis.set(forRibbons(user.id), ribbons, 'ex', 60);
      });
  }
}

export const userProvider = new UserProvider(prismaClient, redisClient);
