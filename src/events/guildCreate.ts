import { redis } from '../data/redisClient';
import type { Event } from '../types/event';

const guildCreate: Event = {
  name: 'guildCreate',
  once: false,
  listener: async (client) => {
    const newCount = client.guilds.cache.size;
    redis
      .publish('guild-count-update', newCount.toString())
      .catch((err) => console.error(err));
  },
};

export default guildCreate;
