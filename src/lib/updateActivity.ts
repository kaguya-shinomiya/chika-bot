import { Client } from 'discord.js';
import { redis } from '../data/redisClient';

export const updateActivity = async (client: Client) => {
  const newCount = client.guilds.cache.size;
  redis
    .publish('guild-count-update', newCount.toString())
    .catch((err) => console.error(err));

  client.user
    ?.setActivity({
      name: `amogus in ${newCount} ${newCount === 1 ? 'server' : 'servers'}`,
      type: 'PLAYING',
    })
    .catch((err) => console.error(err));
};
