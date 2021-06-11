import { Message } from "discord.js";
import { prisma } from "../data/prismaClient";
import { DEFAULT_PREFIX } from "../shared/constants";
import {
  badArgsEmbed,
  badCommandsEmbed,
  genericErrorEmbed,
} from "../shared/embeds";
import { Event } from "../types/event";
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

    if (command.argsCount >= 0 && args.length !== command.argsCount) {
      channel.send(badArgsEmbed(command, args.length));
      return;
    }
    if (command.argsCount === -2 && args.length === 0) {
      channel.send(badArgsEmbed(command, args.length));
      return;
    }

    if (await isOnCooldown(message, command)) return;

    command.execute(message, args).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      channel.send(genericErrorEmbed());
    });
  },
};

export default message;
