import type { Client } from 'discord.js';
import { redis } from '../data/redisClient';

type IActivityUpdater = (client: Client) => void;

export function setGuildCount(client: Client) {
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
}

export function setHelp(client: Client) {
  client.user
    ?.setActivity({
      name: `ck;help`,
      type: 'PLAYING',
    })
    .catch((err) => console.error(err));
}

export function setChikatto(client: Client) {
  client.user
    ?.setActivity({
      name: `Chikatto Chika Chika`,
      type: 'LISTENING',
    })
    .catch((err) => console.error(err));
}

export function setUserCount(client: Client) {
  const newCount = client.users.cache.size;
  redis
    .publish('user-count-update', newCount.toString())
    .catch((err) => console.error(err));

  client.user
    ?.setActivity({
      name: `with ${newCount} ${newCount === 1 ? 'user' : 'users'}`,
      type: 'PLAYING',
    })
    .catch((err) => console.error(err));
}

export const activityUpdaters: IActivityUpdater[] = [
  setGuildCount,
  setHelp,
  setChikatto,
  setUserCount,
];
