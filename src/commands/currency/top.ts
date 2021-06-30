import { CmdCategory } from '@prisma/client';
import { userProvider } from '../../data/database/userProvider';
import { lightErrorEmbed, sendNotInGuild } from '../../shared/embeds';
import { Command } from '../../types/command';
import { MAX_TAKE } from './utils/defaults';
import { sendExceededMaxTake, sendTop } from './utils/embeds';

const top = new Command({
  name: 'top',
  args: [{ name: 'take', optional: true, multi: false }],
  category: CmdCategory.CURRENCY,
  description: 'Hunt down the richest in this server.',
  aliases: ['richest'],

  async execute(message, args) {
    const { channel, guild } = message;
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }

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

    const guildMembers = (await guild.members.fetch()).map(
      (member) => member.user,
    );

    userProvider.getTopRibbonsForUsers(guildMembers, take).then((res) =>
      sendTop(channel, res, {
        locale: guild.name,
        thumbnail: guild.iconURL({ dynamic: true, size: 128 }),
      }),
    );
  },
});

export default top;
