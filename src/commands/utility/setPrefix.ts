import { prisma } from "../../data/prismaClient";
import { DEFAULT_PREFIX } from "../../shared/constants";
import { baseEmbed, sendNotInGuild } from "../../shared/embeds";
import { Command, CommandCategory } from "../../types/command";
import { isAdmin } from "../../utils/validateMessages";

const prefix: Command = {
  name: "set-prefix",
  argsCount: 1,
  category: CommandCategory.utility,
  description: "Set a new prefix for Chika. You'll need to be an admin.",
  usage: `${DEFAULT_PREFIX}set-prefix <new_prefix>`,
  async execute(message, args) {
    const { channel, guild } = message;
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }
    if (!isAdmin(message)) return;
    const [newPrefix] = args;
    prisma.setPrefix(guild.id, newPrefix);

    channel.send(
      baseEmbed().setDescription(`Chika's prefix is now **${newPrefix}**`)
    );
  },
};

export default prefix;
