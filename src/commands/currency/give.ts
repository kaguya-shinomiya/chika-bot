import { CmdCategory } from '@prisma/client';
import { prisma } from '../../data/prismaClient';
import { ribbon_emoji } from '../../shared/assets';
import { baseEmbed, lightErrorEmbed } from '../../shared/embeds';
import { Command } from '../../types/command';
import { groupNum } from '../../lib/typography';

const give = new Command({
  name: 'give',
  args: [{ name: 'user' }, { name: 'amount' }],
  description: `Be charitable and give another user some ribbons.`,
  category: CmdCategory.CURRENCY,
  aliases: ['donate'],

  async execute(message, args) {
    const { author, channel, mentions } = message;
    const beneficiary = mentions.users.first();
    if (!beneficiary) {
      channel.send(lightErrorEmbed(`Tag someone to give ${ribbon_emoji} to!`));
      return;
    }
    if (beneficiary.bot) {
      channel.send(
        lightErrorEmbed(
          `**${beneficiary.tag}** is a bot and does not care for ${ribbon_emoji}...`,
        ),
      );
      return;
    }

    const donation = parseInt(args[args.length - 1], 10);
    if (Number.isNaN(donation)) {
      channel.send(lightErrorEmbed(`Please use a valid number!`));
      return;
    }
    const benefactorStock = await prisma.getRibbons(author);
    if (donation > benefactorStock) {
      channel.send(
        lightErrorEmbed(
          `LOL you're too poor to do that! You only have ${benefactorStock} ${ribbon_emoji}.`,
        ),
      );
      return;
    }

    prisma.incrRibbons(beneficiary, donation);
    prisma.decrRibbons(author, donation);

    channel.send(
      baseEmbed().setDescription(
        `**${beneficiary.username}** has received **${groupNum.format(
          donation,
        )}** ${ribbon_emoji} from ${author.username}!`,
      ),
    );
  },
});

export default give;
