import Discord from 'discord.js';
import { genFullHelpEmbed } from './init/fullHelpEmbed';
import { initialClientCache } from './init/initialClientCache';
import { loadCommands } from './init/loadCommands';
import { loadEventListeners } from './init/loadEventListeners';
import { seedCommands } from './init/seedCommands';
import { setHelp } from './lib/activityUpdaters';

const main = () => {
  const client = new Discord.Client();
  client.login(process.env.APP_TOKEN).then(() => setHelp(client));
  client.commands = loadCommands();
  client.commandsHelp = genFullHelpEmbed(client.commands); // generates full help message
  seedCommands(client.commands);
  client.cache = initialClientCache;
  loadEventListeners(client);
  client.setMaxListeners(2048);
  // initCrons();
};

process.on('unhandledRejection', (err) => {
  console.error(`!!!!! An error has made it to index.ts !!!!!\n`, err);
  throw err;
});

main();
