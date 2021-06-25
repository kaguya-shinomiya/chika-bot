import { CmdCategory } from '@prisma/client';
import { lightErrorEmbed, sendNotInGuild } from '../../shared/embeds';
import { Command } from '../../types/command';
import { setCooldown } from '../../lib/cooldownManager';
import { sendSearchResults } from './utils/embeds';
import { createResultSelectListener } from './utils/listener';
import { searchVideo } from './utils/youtube';

const search = new Command({
  name: 'search',
  description: 'Search for a track on YouTube',
  args: [{ name: 'search_string', multi: true }],
  category: CmdCategory.MUSIC,
  channelCooldown: 15000,

  async execute(message, args) {
    const { channel, client, guild } = message;
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }

    setCooldown(channel.id, this.name, this.channelCooldown!);

    const results = await searchVideo(args.join(' '));
    if (!results) {
      channel.send(lightErrorEmbed('Your search received no results.'));
      return;
    }

    sendSearchResults(channel, results);

    const resultSelectListener = createResultSelectListener(results, {
      channelId: channel.id,
      guildId: guild.id,
    });
    const timeoutCallback = () => {
      client.removeListener('message', resultSelectListener);
    };
    client.on('message', resultSelectListener);
    client.setTimeout(timeoutCallback, this.channelCooldown!);
  },
});

export default search;
