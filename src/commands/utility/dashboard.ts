import { CmdCategory } from '.prisma/client';
import { Command } from '../../types/command';
import { dashboardLink } from './embeds/dashboardLinkEmbed';

const dashboard = new Command({
  name: 'dashboard',
  aliases: ['dbd'],
  description: 'Get a link to the dashboard app',
  args: [],
  category: CmdCategory.UTILITY,
  async execute(ctx) {
    const { channel } = ctx;
    channel.send(dashboardLink);
  },
});

export default dashboard;
