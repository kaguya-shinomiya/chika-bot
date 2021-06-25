import type { Collection, User } from 'discord.js';
import { ribbon_emoji } from '../../../shared/assets';
import { baseEmbed, lightErrorEmbed } from '../../../shared/embeds';
import { GenericChannel } from '../../../types/command';
import { groupNum } from '../../../lib/typography';
import { toListString } from '../../music/utils/embeds';

export const sendRibbonStock = (
  channel: GenericChannel,
  stock: Collection<User, string | null>,
) => {
  const lines = stock.map(
    (count, user) => `${user.toString()}: ${count || 0} ${ribbon_emoji}`,
  );
  channel.send(
    baseEmbed().setDescription(toListString(lines, { noNum: true })),
  );
};

export const sendTop = (
  channel: GenericChannel,
  top: {
    tag: string;
    ribbons: number;
  }[],
  options?: { locale?: string; thumbnail?: string | null },
) => {
  const lines = top.map(
    ({ tag, ribbons }) =>
      `**${tag}**: ${groupNum.format(ribbons)} ${ribbon_emoji}`,
  );
  const partialEmbed = baseEmbed()
    .setTitle(`Wealth Gap in ${options?.locale || 'za Warudo'} :yen:`)
    .setDescription(toListString(lines))
    .setFooter(`Showing top ${lines.length}`);

  channel.send(
    options?.thumbnail
      ? partialEmbed.setThumbnail(options.thumbnail)
      : partialEmbed,
  );
};

export const sendExceededMaxTake = (channel: GenericChannel) =>
  channel.send(lightErrorEmbed('I can only fetch a maximum of 20 results.'));
