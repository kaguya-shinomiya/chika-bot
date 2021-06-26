import { CmdCategory } from '@prisma/client';
import type { Collection, EmbedFieldData, MessageEmbed } from 'discord.js';
import { baseEmbed, detectiveEmbed } from '../shared/embeds';
import type { Command } from '../types/command';
import { stripIndents } from 'common-tags';

export const genFullHelpEmbed = (
  commands: Collection<string, Command>,
): MessageEmbed => {
  const categoryMap: Record<CmdCategory, Command[]> = {} as any;
  commands.forEach((command) => {
    if (categoryMap[command.category]) {
      categoryMap[command.category].push(command);
    } else {
      categoryMap[command.category] = [command];
    }
  });
  const fields: EmbedFieldData[] = [];
  Object.keys(categoryMap).forEach((category) => {
    const cmds = categoryMap[category as CmdCategory].map(
      (command) => `\`${command.name}\``,
    );
    fields.push({
      name: tagEmoji(category as CmdCategory),
      value: cmds.join(', '),
    });
  });
  return detectiveEmbed().setTitle('Chika Commands').addFields(fields);
};

export const helpExtraInfo = baseEmbed().addField(
  'Some notes',
  stripIndents`
  • Chika's default prefix is **ck;**
  • For more info about a specific command, use \`help <command>\`
  • Chika has a simple [landing page](https://www.chikawara.xyz)!`,
);

function tagEmoji(category: CmdCategory) {
  switch (category) {
    case 'CURRENCY':
      return ':moneybag: Currency';
    case 'FUN':
      return ':coffee: Fun';
    case 'GAMES':
      return ':video_game: Game';
    case 'MUSIC':
      return ':headphones: Music';
    case 'UTILITY':
      return ':satellite: Utility';
    default:
      return ':coffee: Fun';
  }
}
