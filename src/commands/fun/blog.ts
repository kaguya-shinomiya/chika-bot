import { CmdCategory } from '.prisma/client';
import _ from 'lodash';
import { blogKey, redis } from '../../data/redisClient';
import { Command } from '../../types/command';
import { blogPage } from './utils/embeds';
import { IBlogPost } from './utils/types';
import { sendPaginated } from '../../lib/sendPaginated';
import { setCooldown } from '../../lib/cooldownManager';

const blog = new Command({
  name: 'blog',
  args: [],
  description: 'Read the Chika blog.',
  category: CmdCategory.FUN,
  channelCooldown: 10000,

  async execute(context) {
    const { channel } = context;

    // retrieve blog posts
    const posts: IBlogPost[] = await redis
      .lrange(blogKey, 0, -1)
      .then((posts) => posts.map((post) => JSON.parse(post)));

    // split into individual embeds
    const pages = _.chunk(posts, 5).map((_posts) => blogPage(_posts));

    // send as paginated
    sendPaginated(channel, pages, { timeout: 60000 });
    setCooldown(channel.id, this.name, this.channelCooldown!);
  },
});

export default blog;
