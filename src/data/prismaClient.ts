import { PrismaClient } from "@prisma/client";
import type { Snowflake, User } from "discord.js";
import {
  DEFAULT_MAX_BALLOON,
  DEFAULT_MIN_BALLOON,
} from "../games/balloon/utils/defaults";
import { DEFAULT_SHIRITORI_MIN_LEN } from "../games/shiritori/utils/defaults";
import {
  redisBalloonMax,
  redisBalloonMin,
  redisGuildPrefix,
  redisRibbons,
  redisShiritoriMinLen,
} from "./redisClient";

class ChikaPrisma extends PrismaClient {
  async getPrefix(guildId: Snowflake) {
    const ping = await redisGuildPrefix.get(guildId);
    if (ping) {
      redisGuildPrefix.expire(guildId, 600);
      return ping;
    }
    return this.guild
      .findUnique({
        where: { guildId },
        select: { prefix: true },
      })
      .then((res) => {
        if (!res?.prefix) return null;
        redisGuildPrefix.set(guildId, res.prefix, "ex", 600);
        return res.prefix;
      });
  }

  async setPrefix(guildId: Snowflake, prefix: string) {
    redisGuildPrefix.set(guildId, prefix, "ex", 600);
    await this.guild.upsert({
      create: { guildId, prefix },
      update: { prefix },
      where: { guildId },
    });
  }

  async getRibbons(user: User) {
    const ping = await redisRibbons.get(user.id);
    if (ping) {
      redisRibbons.expire(user.id, 600);
      return parseInt(ping, 10);
    }
    return this.user
      .findUnique({
        where: { userId: user.id },
        select: { ribbons: true },
      })
      .then((res) => {
        if (!res?.ribbons) {
          redisRibbons.set(user.id, 0, "ex", 600);
          return 0;
        }
        redisRibbons.set(user.id, res.ribbons, "ex", 600);
        return res.ribbons;
      });
  }

  async incrRibbons(user: User, incrby: number) {
    return this.user
      .upsert({
        create: { userId: user.id, tag: user.tag, ribbons: incrby },
        update: { ribbons: { increment: incrby } },
        where: { userId: user.id },
      })
      .then((_user) => redisRibbons.set(user.id, _user.ribbons, "ex", 600));
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
      if (!res?.ribbons) {
        redisRibbons.set(user.id, 0, "ex", 600);
        return;
      }
      redisRibbons.set(user.id, res.ribbons, "ex", 600);
    });
  }

  async getGlobalTopRibbons(take = 10) {
    return this.user.findMany({
      take,
      orderBy: { ribbons: "desc" },
      select: { tag: true, ribbons: true },
    });
  }

  async getLocalTopRibbons(members: User[], take = 10) {
    const IDs = members.map((member) => member.id);
    return this.user.findMany({
      take,
      select: { ribbons: true, tag: true },
      where: { userId: { in: IDs } },
      orderBy: { ribbons: "desc" },
    });
  }

  async setBalloonMin(minVol: number, guildId: string) {
    // validation to be done in app code
    await this.guild
      .upsert({
        update: {
          balloon: {
            upsert: { update: { minVol }, create: { minVol } },
          },
        },
        where: { guildId },
        create: {
          guildId,
          balloon: {
            connectOrCreate: { create: { minVol }, where: { guildId } },
          },
        },
      })
      .then(() => {
        redisBalloonMin.set(guildId, minVol, "ex", 600);
      });
  }

  async getBalloonMin(guildId: string) {
    const ping = await redisBalloonMin.get(guildId);
    if (ping) {
      redisBalloonMin.expire(guildId, 600);
      return parseInt(ping, 10);
    }
    return this.balloon
      .findUnique({
        where: { guildId },
        select: { minVol: true },
      })
      .then((res) => {
        if (!res?.minVol) return DEFAULT_MIN_BALLOON;
        return res.minVol;
      });
  }

  async setBalloonMax(maxVol: number, guildId: string) {
    // validation to be done in app code
    await this.guild
      .upsert({
        update: {
          balloon: {
            upsert: { update: { maxVol }, create: { maxVol } },
          },
        },
        where: { guildId },
        create: {
          guildId,
          balloon: {
            create: { maxVol },
          },
        },
      })
      .then(() => {
        redisBalloonMax.set(guildId, maxVol, "ex", 600);
      });
  }

  async getBalloonMax(guildId: string) {
    const ping = await redisBalloonMax.get(guildId);
    if (ping) {
      redisBalloonMax.expire(guildId, 600);
      return parseInt(ping, 10);
    }
    return this.balloon
      .findUnique({
        where: { guildId },
        select: { maxVol: true },
      })
      .then((res) => {
        if (!res?.maxVol) return DEFAULT_MAX_BALLOON;
        return res.maxVol;
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
      .then(() => redisShiritoriMinLen.set(guildId, minLen, "ex", 600));
  }

  async getShiritoriMinLen(guildId: string | undefined) {
    if (!guildId) return DEFAULT_SHIRITORI_MIN_LEN;

    const ping = await redisShiritoriMinLen.get(guildId);
    if (ping) {
      redisShiritoriMinLen.expire(guildId, 600);
      return parseInt(ping, 10);
    }
    return this.shiritori
      .findUnique({
        where: { guildId },
        select: { minLen: true },
      })
      .then((res) => {
        if (!res?.minLen) return DEFAULT_SHIRITORI_MIN_LEN;
        return res.minLen;
      });
  }
}

export const prisma = new ChikaPrisma();
