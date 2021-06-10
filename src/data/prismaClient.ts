import { PrismaClient } from "@prisma/client";
import type { Snowflake } from "discord.js";
import { guildPrefix } from "./redisClient";

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
}

export const prisma = new ChikaPrisma();
