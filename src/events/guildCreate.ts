import { redis } from '../data/redisClient';
import type { Event } from '../types/event';
import { pubGuildCount, updateGuildList } from './lib/guild';

const guildCreate: Event = {
  name: 'guildCreate',
  once: false,
  listener: async (client) => {
    const { cache: guilds } = client.guilds;
    await pubGuildCount(redis, guilds.size);
    // update the list in redis
    const ids = guilds.map((guild) => guild.id);
    await updateGuildList(redis, ids);
  },
};

export default guildCreate;
