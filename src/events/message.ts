import { Message } from 'discord.js';
import { guildProvider } from '../data/providers/guildProvider';
import { validateArgsCount } from '../lib/validateArgsCount';
import { isOnCooldown } from '../lib/validateCooldowns';
import { DEFAULT_PREFIX } from '../shared/constants';
import { badCommandsEmbed, sendBlockedCommand } from '../shared/embeds';
import { CriticalError } from '../shared/errors';
import { Event } from '../types/event';

// TODO: add better arg validation
// check arg types too

const message: Event = {
  name: 'message',
  once: false,
  async listener(client, message: Message) {
    const { guild, content, author, channel } = message;
    if (author.bot) return;

    // check prefix
    let prefix = DEFAULT_PREFIX;
    if (guild) {
      prefix = await guildProvider.getPrefix(guild.id);
    }
    const prefixRe = new RegExp(`^${prefix}`, 'i');
    if (!prefixRe.test(content)) return;

    // check if command exists
    const args = content.split(/ +/);
    const sentCommand = args.shift()?.toLowerCase().replace(prefix, '');
    if (!sentCommand) return;
    const command = client.commands.find(
      (_command) =>
        _command.name === sentCommand ||
        !!_command.aliases?.includes(sentCommand),
    );
    if (!command) {
      channel.send(badCommandsEmbed(sentCommand));
      return;
    }

    // check if command is blocked
    if (guild) {
      const isBlocked = await guildProvider.isBlocked(guild.id, command.name);
      if (isBlocked) {
        sendBlockedCommand(channel, command.name);
        return;
      }
    }

    // check argument count
    if (!validateArgsCount(command, args, channel)) return;

    if (await isOnCooldown(message, command)) return;

    try {
      command.execute(message, args);
    } catch (err) {
      console.error(err);
      if (err instanceof CriticalError) throw err;
    }
  },
};

export default message;
