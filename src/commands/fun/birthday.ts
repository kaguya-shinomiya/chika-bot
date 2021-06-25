import { CmdCategory } from '.prisma/client';
import { ishigami_cake_png } from '../../shared/assets';
import { baseEmbed, lightErrorEmbed } from '../../shared/embeds';
import { Command } from '../../types/command';
import { withAnd } from '../../lib/typography';

const birthday = new Command({
  name: 'birthday',
  aliases: ['bd'],
  args: [
    { name: 'users' },
    { name: 'more_users', optional: true, multi: true },
  ],
  category: CmdCategory.FUN,
  description: 'Wish your m8s a happy birthday.',
  execute: async (message) => {
    const { author, mentions, channel } = message;
    if (!mentions.users.size) {
      channel.send(lightErrorEmbed('Tag someone in your birthday wish!'));
      return;
    }
    const births = mentions.users.map((user) => user.toString());
    channel.send(
      baseEmbed()
        .setDescription(
          `${author.toString()} realizes that ${withAnd(births)} ${
            births.length === 1 ? 'has' : 'have'
          } aged one year since 365 days ago.`,
        )
        .setImage(ishigami_cake_png)
        .setFooter('Happy Birthday!!'),
    );
  },
});

export default birthday;
