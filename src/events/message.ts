import { Message } from "discord.js";
import { prisma } from "../data/prismaClient";
import { DEFAULT_PREFIX } from "../shared/constants";
import { badCommandsEmbed, genericErrorEmbed } from "../shared/embeds";
import { Event } from "../types/event";
import { validateArgsCount } from "../utils/validateArgsCount";
import { isOnCooldown } from "../utils/validateCooldowns";

const message: Event = {
  name: "message",
  once: false,
  // eslint-disable-next-line no-shadow
  async listener(client, message: Message) {
    const { guild, content, author, channel } = message;
    if (author.bot) return;

    let prefix = DEFAULT_PREFIX;
    if (guild) {
      prefix = (await prisma.getPrefix(guild.id)) || DEFAULT_PREFIX;
    }
    const prefixRe = new RegExp(`^${prefix}`, "i");
    if (!prefixRe.test(content)) return;

    const args = content.split(/ +/);
    const sentCommand = args.shift()?.toLowerCase().replace(prefix, "");
    if (!sentCommand) return;
    const command = client.commands.find(
      (_command) =>
        _command.name === sentCommand ||
        !!_command.aliases?.includes(sentCommand)
    );
    if (!command) {
      channel.send(badCommandsEmbed(sentCommand));
      return;
    }

    if (!validateArgsCount(command, args, channel)) return;

    if (await isOnCooldown(message, command)) return;

    command.execute(message, args).catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      channel.send(genericErrorEmbed());
    });
  },
};

export default message;
