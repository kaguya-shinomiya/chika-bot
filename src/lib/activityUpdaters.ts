import type { Client } from 'discord.js';

type IActivityUpdater = (client: Client) => void;

export function setGuildCount(client: Client) {
  const guildCount = client.guilds.cache.size;
  client.user
    ?.setActivity({
      name: `amogus in ${guildCount} ${
        guildCount === 1 ? 'server' : 'servers'
      }`,
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
  const userCount = client.guilds.cache.reduce((acc, guild) => {
    return acc + guild.memberCount;
  }, 0);
  client.user
    ?.setActivity({
      name: `with ${userCount} ${userCount === 1 ? 'user' : 'users'}`,
      type: 'PLAYING',
    })
    .catch((err) => console.error(err));
}

export function setKaguya(client: Client) {
  client.user
    ?.setActivity({
      name: `ck;ka`,
      type: 'PLAYING',
    })
    .catch((err) => console.error(err));
}

export const activityUpdaters: IActivityUpdater[] = [
  setGuildCount,
  setHelp,
  setChikatto,
  setUserCount,
  setKaguya,
];
