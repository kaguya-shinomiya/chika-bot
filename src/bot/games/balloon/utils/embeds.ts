import type { User } from 'discord.js';
import { ribbon_emoji } from '../../../shared/assets';
import { baseEmbed } from '../../../shared/embeds';
import { GenericChannel } from '../../../types/command';

export const sendPopped = (
  channel: GenericChannel,
  info: { popper: User; isBankrupt: boolean; winAmt: number },
) => {
  const { popper, isBankrupt, winAmt } = info;
  channel.send(
    baseEmbed()
      .setTitle(`Boom, yo! :boom:`)
      .setDescription(
        `
        The balloon bursts in **${popper.username}**'s face!
  
        ${
          isBankrupt
            ? `**${popper.username}** is bankrupt!\nEveryone else receives **+ ${winAmt}** ${ribbon_emoji}, sponsored by the Chika Bank.`
            : `**${popper.username}** pays everyone else **${winAmt}** ${ribbon_emoji}.`
        }
        `,
      ),
  );
};
