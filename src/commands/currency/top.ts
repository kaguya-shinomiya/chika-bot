import { prisma } from "../../data/prismaClient";
import { sendNotInGuild } from "../../shared/embeds";
import { Command, CommandCategory, PartialCommand } from "../../types/command";
import { genUsage } from "../../utils/genUsage";
import { sendTop } from "./utils/embeds";

const top: PartialCommand = {
  name: "top",
  args: [],
  category: CommandCategory.CURRENCY,
  description: "Hunt down the richest in this server.",
  aliases: ["richest"],

  async execute(message) {
    const { channel, guild } = message;
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }

    prisma
      .getLocalTopRibbons(guild.members.cache.map((member) => member.user))
      .then((res) =>
        sendTop(channel, res, {
          locale: guild.name,
          thumbnail: guild.iconURL({ dynamic: true, size: 64 }),
        })
      );
  },
};

genUsage(top);
export default top as Command;