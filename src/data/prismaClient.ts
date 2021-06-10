import { PrismaClient } from "@prisma/client";
import type { Snowflake, User } from "discord.js";
import { GLOBAL_RIBBONS } from "../shared/constants";
import { guildPrefix, ribbons } from "./redisClient";

class ChikaPrisma extends PrismaClient {
  async getPrefix(guildId: Snowflake) {
    const ping = await guildPrefix.get(guildId);
    if (ping) return ping;
    return this.guild
      .findUnique({
        where: { guildId },
        select: { prefix: true },
      })
      .then((res) => {
        if (!res?.prefix) return null;
        guildPrefix.set(guildId, res.prefix, "ex", 3600);
        return res.prefix;
      });
  }

  async setPrefix(guildId: Snowflake, prefix: string) {
    guildPrefix.set(guildId, prefix, "ex", 3600);
    await this.guild.upsert({
      create: { guildId, prefix },
      update: { prefix },
      where: { guildId },
    });
  }

  async getRibbons(user: User) {
    const ping = await ribbons.zscore(GLOBAL_RIBBONS, user.tag);
    if (ping) return parseInt(ping, 10);
    return this.user
      .findUnique({
        where: { userId: user.id },
        select: { ribbons: true },
      })
      .then((res) => {
        if (!res?.ribbons) {
          ribbons.zadd(GLOBAL_RIBBONS, [0, user.tag]);
          return 0;
        }
        ribbons.zadd(GLOBAL_RIBBONS, [res.ribbons, user.tag]);
        return res.ribbons;
      });
  }

  async incrRibbons(user: User, incrby: number) {
    await this.user
      .upsert({
        create: { userId: user.id, username: user.username, ribbons: incrby },
        update: { ribbons: { increment: incrby } },
        where: { userId: user.id },
      })
      .then((_user) => ribbons.zadd(GLOBAL_RIBBONS, [_user.ribbons, user.tag]));
  }

  async decrRibbons(user: User, decrby: number) {
    await this.user
      .upsert({
        create: { userId: user.id, username: user.username, ribbons: 0 },
        update: { ribbons: { decrement: decrby } },
        where: { userId: user.id },
      })
      .then((_user) => ribbons.zadd(GLOBAL_RIBBONS, [_user.ribbons, user.tag]));
  }
}

export const prisma = new ChikaPrisma();
