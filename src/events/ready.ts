import { commaListsAnd } from 'common-tags';
import { redis } from '../data/redisClient';
import { Event } from '../types/event';
import { updateGuildList } from './lib/guild';

const ready: Event = {
  name: 'ready',
  once: true,
  async listener(client) {
    console.log('Chika bot is ready.');
    // set guilds in redis
    const { cache } = client.guilds;
    const ids = cache.map((guild) => guild.id);
    await updateGuildList(redis, ids);
    console.log(commaListsAnd`We are in ${cache.map((guild) => guild.name)}.`);
  },
};

export default ready;
