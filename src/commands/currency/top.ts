import { prisma } from "../../data/prismaClient";
import { DEFAULT_PREFIX } from "../../shared/constants";
import { sendNotInGuild } from "../../shared/embeds";
import { Command, CommandCategory } from "../../types/command";
import { sendTop } from "./utils/embeds";

const top: Command = {
  name: "top",
  argsCount: 0,
  category: CommandCategory.currency,
  description: "Hunt down the richest in this server.",
  usage: `${DEFAULT_PREFIX}top`,
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

export default top;
