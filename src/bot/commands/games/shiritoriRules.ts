import { CmdCategory } from '@prisma/client';
import { shiritoriGame } from '../../games/shiritori';
import { Command } from '../../types/command';

const shiritoriRules = new Command({
  name: 'shiritori-rules',
  aliases: ['sh-rules'],
  args: [],
  category: CmdCategory.GAMES,
  description: 'Check the rules for Shiritori.',

  async execute(message) {
    const { channel } = message;
    channel.send(shiritoriGame.rules);
  },
});

export default shiritoriRules;
