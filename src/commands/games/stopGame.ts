import { CmdCategory } from '.prisma/client';
import { blindUnblock } from '../../games/utils/manageState';
import { lightErrorEmbed } from '../../shared/embeds';
import { Command } from '../../types/command';

const stopGame = new Command({
  name: 'stop-game',
  aliases: ['sg'],
  args: [],
  category: CmdCategory.GAMES,
  description: 'Exit from the current game in session.',
  execute: async (ctx) => {
    const { channel, author } = ctx;
    blindUnblock(ctx).then(
      () => {
        channel.send(
          lightErrorEmbed(`**${author.username}** has stopped the game.`),
        );
      },
      (err) => channel.send(lightErrorEmbed(err)),
    );
  },
});

export default stopGame;
