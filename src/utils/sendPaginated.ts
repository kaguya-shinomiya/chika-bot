import type { MessageEmbed, MessageReaction, User } from 'discord.js';
import { GenericChannel } from '../types/command';
import { left_arrow, right_arrow } from '../shared/assets';

interface sendPaginatedOptions {
  leftEmoji?: string;
  rightEmoji?: string;
  timeout?: number;
}

// TODO need permissions to edit messages

export const sendPaginated = (
  channel: GenericChannel,
  pages: MessageEmbed[],
  options?: sendPaginatedOptions,
) => {
  const leftEmoji = options?.leftEmoji || left_arrow;
  const rightEmoji = options?.rightEmoji || right_arrow;
  const timeout = options?.timeout || 30000; // half a minute by default

  let on = 0; // page number
  const maxOn = pages.length - 1;
  channel.send(pages[on].setFooter(`1/${maxOn + 1}`)).then(async (message) => {
    await message.react(left_arrow).then(() => message.react(right_arrow));

    const filter = (reaction: MessageReaction, user: User) =>
      (reaction.emoji.name === leftEmoji ||
        reaction.emoji.name === rightEmoji) &&
      !user.bot;
    const collector = message.createReactionCollector(filter, {
      time: timeout,
      dispose: true,
    });

    const reactHandler = (reaction: MessageReaction) => {
      switch (reaction.emoji.name) {
        case left_arrow:
          on = on === 0 ? maxOn : on - 1;
          break;
        case right_arrow:
          on = on === maxOn ? 0 : on + 1;
          break;
        default:
          break;
      }
      message.edit(pages[on].setFooter(`${on + 1}/${maxOn + 1}`));
    };

    collector.on('remove', reactHandler);
    collector.on('collect', reactHandler);

    collector.on('end', () => {
      if (!message.deleted) {
        message.reactions.removeAll();
      }
    });
  });
};
