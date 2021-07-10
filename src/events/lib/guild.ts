import type { Redis } from 'ioredis';

export async function pubGuildCount(redis: Redis, count: number) {
  try {
    return redis.publish('guild-count-update', count.toString());
  } catch (err) {
    return console.error(err);
  }
}

export async function updateGuildList(redis: Redis, ids: string[]) {
  try {
    // we'll use the 'inGuilds' key
    return redis.set('inGuilds', JSON.stringify(ids));
  } catch (err) {
    return console.error(err);
  }
}
