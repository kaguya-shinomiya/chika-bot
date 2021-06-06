import Discord from "discord.js";
import { initCooldownManager } from "./loading/initCooldownManager";
import { initialClientCache } from "./loading/initialClientCache";
import { initRedis } from "./loading/initRedis";
import { loadCommands } from "./loading/loadCommands";
import { loadEventListeners } from "./loading/loadEventListeners";
import { loadGames } from "./loading/loadGames";
import { prepareCommandsHelp } from "./loading/prepareCommandsHelp";

require("dotenv-safe").config();

const main = async () => {
  const client = new Discord.Client();
  client.login(process.env.APP_TOKEN);
  client.commands = loadCommands();
  [client.games, client.gamesList] = loadGames();
  client.commandsHelp = prepareCommandsHelp(client.commands); // generates full help message
  client.cache = initialClientCache;

  initCooldownManager(client);
  loadEventListeners(client, initRedis());

  client.setMaxListeners(2048);
};

// eslint-disable-next-line no-console
main().catch((err) => console.log(err));
