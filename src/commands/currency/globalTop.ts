import { CmdCategory } from '@prisma/client';
import { userProvider } from '../../data/database/userProvider';
import { genericErrorEmbed, lightErrorEmbed } from '../../shared/embeds';
import { Command } from '../../types/command';
import { MAX_TAKE } from './utils/defaults';
import { sendExceededMaxTake, sendTop } from './utils/embeds';

const globalTop = new Command({
  name: 'global-top',
  description: `Track down the top 1%.`,
  args: [{ name: 'take', optional: true, multi: false }],
  category: CmdCategory.CURRENCY,
  aliases: ['gt'],

  async execute(message, args) {
    const { channel } = message;
    let take;
    const [count] = args;
    if (count) {
      const _take = parseInt(count, 10);
      if (Number.isNaN(_take)) {
        channel.send(lightErrorEmbed('Gimme a number yo.'));
        return;
      }
      if (_take > MAX_TAKE) {
        sendExceededMaxTake(channel);
        return;
      }
      take = _take;
    }
    const top = await userProvider.getGlobalTopRibbons(take);
    if (!top) {
      channel.send(genericErrorEmbed());
      return;
    }
    sendTop(channel, top);
  },
});

export default globalTop;
