import { CmdCategory } from '@prisma/client';
import { balloonGame } from '../../games/balloon';
import { checkAndBlock } from '../../games/utils/manageState';
import { lightErrorEmbed } from '../../shared/embeds';
import { Command } from '../../types/command';

const balloon = new Command({
  name: 'balloon',
  aliases: ['bl'],
  args: [],
  category: CmdCategory.GAMES,
  description: 'Chika hands you a balloon and you must pump it.',
  async execute(message) {
    checkAndBlock(balloonGame, message).then(
      () => balloonGame.pregame(message),
      (err) => message.channel.send(lightErrorEmbed(err)),
    );
  },
});

export default balloon;
