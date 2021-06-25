import { CmdCategory } from '.prisma/client';
import { Command } from '../../types/command';
import {
  baseEmbed,
  lightErrorEmbed,
  sendNotInGuild,
} from '../../shared/embeds';
import { prisma } from '../../data/prismaClient';

const shiritoriHand = new Command({
  name: 'shiritori-hand',
  aliases: ['sh-hand'],
  args: [{ name: 'size', optional: true, multi: false }],
  category: CmdCategory.GAMES,
  description: 'Check or set the initial hand size in Shiritori.',
  async execute(ctx, args) {
    const { channel, guild } = ctx;
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }

    const [_newSize] = args;
    if (!_newSize) {
      const currHand = await prisma.getShiritoriHandSize(guild.id);
      channel.send(
        baseEmbed().setDescription(
          `Current starting hand size: **${currHand}**`,
        ),
      );
      return;
    }

    const newSize = parseInt(_newSize, 10);
    if (Number.isNaN(newSize)) {
      channel.send(lightErrorEmbed('Please give me a valid number!'));
      return;
    }
    if (newSize < 0) {
      channel.send(lightErrorEmbed('Haha how does that even work.'));
      return;
    }
    if (newSize > 10) {
      channel.send(lightErrorEmbed('I can only issue a maximum of 12 cards!'));
      return;
    }
    await prisma.setShiritoriHandSize(guild.id, newSize);
    channel.send(
      baseEmbed().setDescription(
        `The hand size for Shiritori has been set to **${newSize}**!
			This will apply on the next game.`,
      ),
    );
  },
});

export default shiritoriHand;
