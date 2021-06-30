import { CmdCategory } from '@prisma/client';
import { guildProvider } from '../../data/providers/guildProvider';
import { isAdmin } from '../../lib/validateMessages';
import { baseEmbed, sendNotInGuild } from '../../shared/embeds';
import { Command } from '../../types/command';

const prefix = new Command({
  name: 'set-prefix',
  args: [{ name: 'new_prefix' }],
  category: CmdCategory.UTILITY,
  description: "Set a new prefix for Chika. You'll need to be an admin.",

  async execute(message, args) {
    const { channel, guild } = message;
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }
    if (!isAdmin(message)) return;
    const [newPrefix] = args;
    guildProvider.setPrefix(guild.id, newPrefix);

    channel.send(
      baseEmbed().setDescription(`Chika's prefix is now **${newPrefix}**`),
    );
  },
});

export default prefix;
