import { CmdCategory } from '@prisma/client';
import { stripIndents } from 'common-tags';
import ms from 'ms';
import { userProvider } from '../../data/providers/userProvider';
import { getCooldown, setCooldown } from '../../lib/cooldownManager';
import { endOfToday } from '../../lib/time';
import { ribbon_emoji } from '../../shared/assets';
import { baseEmbed, lightErrorEmbed } from '../../shared/embeds';
import { Command } from '../../types/command';

const daily = new Command({
  name: 'daily',
  category: CmdCategory.CURRENCY,
  args: [],
  description: 'Collect your daily dose of ribbons.',

  async execute(message) {
    const { author, channel } = message;

    const pttl = await getCooldown(author.id, this.name);

    if (pttl) {
      channel.send(
        lightErrorEmbed(
          stripIndents`You've already collected today's ribbons!
          Please wait **${ms(pttl)}** before collecting again.`,
        ),
      );
      return;
    }

    const toAward = Math.floor(Math.random() * 200 + 100);
    channel.send(
      baseEmbed().setDescription(
        `**+ ${toAward}** ribbons ${ribbon_emoji} for **${author.username}**!`,
      ),
    );

    const nowStamp = Date.now();
    const cooldown = endOfToday() - nowStamp;

    setCooldown(author.id, this.name, cooldown);
    userProvider.incrRibbons(author, toAward);
  },
});

export default daily;
