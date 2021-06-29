import { CmdCategory } from '.prisma/client';
import { Command } from '../../types/command';
import type { IBlogPost } from './utils/types';
import { blogKey, redis } from '../../data/redisClient';
import { baseEmbed } from '../../shared/embeds';
import { white_check_mark } from '../../shared/assets';
import { setCooldown } from '../../lib/cooldownManager';

// TODO: enable anonymous posts
const blogPost = new Command({
  name: 'blog-post',
  aliases: ['bp', 'post'],
  description: 'Post a post on the Chika blog.',
  args: [{ name: 'post', optional: false, multi: true }],
  category: CmdCategory.FUN,
  userCooldown: 10000,

  async execute(context, args) {
    const { channel, author } = context;

    // get the post
    const message = args.join(' ');
    const toStore: IBlogPost = {
      author: author.tag,
      time: Date.now(),
      message,
    };

    // store the post
    redis
      .pipeline()
      .lpush(blogKey, JSON.stringify(toStore))
      .ltrim(blogKey, 0, 50)
      .exec();

    setCooldown(author.id, this.name, this.userCooldown!);
    // ack
    channel.send(
      baseEmbed().setDescription(
        `${white_check_mark} **${author.username}** posted!`,
      ),
    );
  },
});

export default blogPost;
