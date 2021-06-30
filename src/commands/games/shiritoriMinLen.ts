import { CmdCategory } from '@prisma/client';
import { shiritoriProvider } from '../../data/database/shiritoriProvider';
import {
  baseEmbed,
  lightErrorEmbed,
  sendNotInGuild,
} from '../../shared/embeds';
import { Command } from '../../types/command';

const shiritoriMinLen = new Command({
  name: 'shiritori-minlen',
  aliases: ['sh-min'],
  args: [{ name: 'new_min', optional: true }],
  category: CmdCategory.GAMES,
  description: 'Check or set the minimum word length in Shiritori.',

  async execute(message, args) {
    const { channel, guild } = message;
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }

    const [_newMin] = args;
    if (!_newMin) {
      const currMin = await shiritoriProvider.getMinLen(guild.id);
      channel.send(
        baseEmbed().setDescription(`Current min word length: **${currMin}**`),
      );
      return;
    }

    const newMin = parseInt(_newMin, 10);
    if (Number.isNaN(newMin)) {
      channel.send(lightErrorEmbed(`Please give me a valid number!`));
      return;
    }
    if (newMin < 0) {
      channel.send(lightErrorEmbed(`Bruh.`));
      return;
    }
    await shiritoriProvider.setMinLen(guild.id, newMin);
    channel.send(
      baseEmbed().setDescription(
        `The minimum word length for Shiritori has been set to **${newMin}**!
			This will apply on the next game.`,
      ),
    );
  },
});

export default shiritoriMinLen;
