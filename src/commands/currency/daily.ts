import { CmdCategory } from '@prisma/client';
import { prisma } from '../../data/prismaClient';
import { ribbon_emoji } from '../../shared/assets';
import { baseEmbed, lightErrorEmbed } from '../../shared/embeds';
import { Command } from '../../types/command';
import { getCooldown, setCooldown } from '../../lib/cooldownManager';
import { endOfToday, secToWordString } from '../../lib/time';
import { stripIndents } from 'common-tags';

const daily = new Command({
  name: 'daily',
  category: CmdCategory.CURRENCY,
  args: [],
  description: 'Collect your daily dose of ribbons.',

  async execute(message) {
    const { author, channel } = message;

    const cooldownDuration = await getCooldown(author.id, this.name);

    if (cooldownDuration) {
      channel.send(
        lightErrorEmbed(
          stripIndents`You've already collected today's ribbons!
          Please wait ${secToWordString(
            cooldownDuration,
          )} before collecting again.`,
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
    prisma.incrRibbons(author, toAward);
  },
});

export default daily;
