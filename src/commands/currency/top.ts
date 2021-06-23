import { CmdCategory } from '@prisma/client';
import { prisma } from '../../data/prismaClient';
import { sendNotInGuild } from '../../shared/embeds';
import { Command } from '../../types/command';
import { sendTop } from './utils/embeds';

const top = new Command({
  name: 'top',
  args: [],
  category: CmdCategory.CURRENCY,
  description: 'Hunt down the richest in this server.',
  aliases: ['richest'],

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
        }),
      );
  },
});

export default top;
