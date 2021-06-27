import { Client } from 'discord.js';
import { CronJob } from 'cron';
import { activityUpdaters } from '../lib/activityUpdaters';

const shuffleActivity = async () => {
  const client = new Client();
  await client.login(process.env.APP_TOKEN);
  const todo =
    activityUpdaters[Math.floor(Math.random() * activityUpdaters.length)];
  todo(client);
};
const shuffleActivityCronJob = new CronJob('* */15 * * * *', shuffleActivity);

export function initCrons() {
  shuffleActivityCronJob.start();
}
