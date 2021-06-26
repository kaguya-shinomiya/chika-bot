import { stripIndents } from 'common-tags';
import { Message } from 'discord.js';
import { prisma } from '../data/prismaClient';
import { validateArgsCount } from '../lib/validateArgsCount';
import { isOnCooldown } from '../lib/validateCooldowns';
import { DEFAULT_PREFIX } from '../shared/constants';
import { badCommandsEmbed, lightErrorEmbed } from '../shared/embeds';
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

    let prefix = DEFAULT_PREFIX;
    if (guild) {
      prefix = (await prisma.getPrefix(guild.id)) || DEFAULT_PREFIX;
    }
    const prefixRe = new RegExp(`^${prefix}`, 'i');
    if (!prefixRe.test(content)) return;

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

    // this is just a temporary monkey patch
    if (command.name === 'play') {
      channel.send(
        lightErrorEmbed(stripIndents`Sorry, Music playing is broken for now ᕙ(⇀‸↼‶)ᕗ
        There's a bug with ytdl which should be patched soon.`),
      );
      return;
    }

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
