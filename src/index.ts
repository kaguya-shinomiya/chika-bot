import Discord from 'discord.js';
import { setIntervals } from './init/cron';
import { genFullHelpEmbed } from './init/fullHelpEmbed';
import { initialClientCache } from './init/initialClientCache';
import { loadCommands } from './init/loadCommands';
import { loadEventListeners } from './init/loadEventListeners';
import { seedCommands } from './init/seedCommands';
import { setHelp } from './lib/activityUpdaters';

const main = () => {
  // instantiate the client
  const client = new Discord.Client();
  // login to the gateway, and set our status
  client.login(process.env.APP_TOKEN).then(() => setHelp(client));
  // load commands
  client.commands = loadCommands();
  // seed commands to our database
  seedCommands(client.commands);
  // generates help message based on commands
  client.commandsHelp = genFullHelpEmbed(client.commands);
  // creates a "cache" object
  client.cache = initialClientCache;
  // apply event listeners
  loadEventListeners(client);
  client.setMaxListeners(2048);
  // "cron-like" jobs
  setIntervals(client);
};

process.on('unhandledRejection', (err) => {
  console.error(`!!!!! An error has made it to index.ts !!!!!\n`, err);
  throw err;
});

main();
