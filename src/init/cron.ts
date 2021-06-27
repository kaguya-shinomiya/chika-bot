import type { Client } from 'discord.js';
import { activityUpdaters } from '../lib/activityUpdaters';

export function setIntervals(client: Client) {
  client.setInterval(() => {
    const updater =
      activityUpdaters[Math.floor(Math.random() * activityUpdaters.length)];
    updater(client);
  }, 1000 * 60 * 15);
}
