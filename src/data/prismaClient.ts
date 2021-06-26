import { PrismaClient } from '@prisma/client';
import type { Snowflake, User } from 'discord.js';
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
  forPrefix,
  forRibbons,
  forShiritoriHand,
  forShiritoriMinLen,
  redis,
} from './redisClient';

class ChikaPrisma extends PrismaClient {
  async getPrefix(guildId: Snowflake) {
    const ping = await redis.get(forPrefix(guildId));
    if (ping) {
      redis.expire(forPrefix(guildId), 60);
      return ping;
    }
    return this.guild
      .findUnique({
        where: { guildId },
        select: { prefix: true },
      })
      .then((res) => {
        if (!res?.prefix) return null;
        redis.set(forPrefix(guildId), res.prefix, 'ex', 60);
        return res.prefix;
      });
  }

  async setPrefix(guildId: Snowflake, prefix: string) {
    redis.set(forPrefix(guildId), prefix, 'ex', 60);
    await this.guild.upsert({
      create: { guildId, prefix },
      update: { prefix },
      where: { guildId },
    });
  }

  async getRibbons(user: User) {
    const ping = await redis.get(forRibbons(user.id));
    console.log('got ribbons from redis: ', ping);
    if (ping) {
      redis.expire(forRibbons(user.id), 60);
      return parseInt(ping, 10);
    }
    console.log('redis did not have the ribbon count');
    return this.user
      .findUnique({
        where: { userId: user.id },
        select: { ribbons: true },
      })
      .then((res) => {
        console.log('got from prisma: ', res);
        const ribbons = res?.ribbons || 0;
        redis.set(forRibbons(user.id), ribbons, 'ex', 60);
        return ribbons;
      });
  }

  async incrRibbons(user: User, incrby: number) {
    return this.user
      .upsert({
        where: { userId: user.id },
        update: { ribbons: { increment: incrby } },
        create: { userId: user.id, tag: user.tag, ribbons: incrby },
      })
      .then((_user) => redis.set(forRibbons(user.id), _user.ribbons, 'ex', 60));
  }

  async decrRibbons(user: User, decrby: number) {
    await this.$transaction([
      this.$executeRaw<number>`
        INSERT INTO "User" ("userId", tag, ribbons)
        VALUES (${user.id}, ${user.tag}, ${0})
        ON CONFLICT ("userId") DO UPDATE
        SET ribbons =
          CASE
            WHEN "User".ribbons < ${decrby} THEN ${0}
            ELSE "User".ribbons - ${decrby}
          END;`,
      this.user.findUnique({
        where: { userId: user.id },
        select: { ribbons: true },
      }),
    ]).then((_res) => {
      const [, res] = _res;
      const ribbons = res?.ribbons || 0;
      redis.set(forRibbons(user.id), ribbons, 'ex', 60);
    });
  }

  async getGlobalTopRibbons(take = 10) {
    return this.user.findMany({
      take,
      orderBy: { ribbons: 'desc' },
      select: { tag: true, ribbons: true },
    });
  }

  async getLocalTopRibbons(members: User[], take = 10) {
    const IDs = members.map((member) => member.id);
    return this.user.findMany({
      take,
      select: { ribbons: true, tag: true },
      where: { userId: { in: IDs } },
      orderBy: { ribbons: 'desc' },
    });
  }

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
