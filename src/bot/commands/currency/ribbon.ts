import { CmdCategory } from '@prisma/client';
import { prisma } from '../../data/prismaClient';
import { ribbon_emoji } from '../../shared/assets';
import { baseEmbed } from '../../shared/embeds';
import { Command } from '../../types/command';

const ribbon = new Command({
  name: 'ribbon',
  description: 'Check how many ribbons you or another user has.',
  args: [{ name: 'user', optional: true }],
  category: CmdCategory.CURRENCY,
  aliases: ['r'],
  async execute(message) {
    const { mentions, author, channel } = message;
    const user = mentions.users.first() || author;

    const stock = await prisma.getRibbons(user);
    channel.send(
      baseEmbed().setDescription(
        `**${user.tag}** has **${stock}** ${ribbon_emoji}`,
      ),
    );
  },
});

export default ribbon;
