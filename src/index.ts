import Discord, { Collection } from "discord.js";
import dotenv from "dotenv-safe";
import { initCooldownManager } from "./loading/initCooldownManager";
import { initRedis } from "./loading/initRedis";
import { loadCommands } from "./loading/loadCommands";
import { loadEventListeners } from "./loading/loadEventListeners";
import { loadGames } from "./loading/loadGames";
import { prepareCommandsHelp } from "./loading/prepareCommandsHelp";

dotenv.config();

// TODO need to register only 1 listener per command type?

const main = async () => {
  const client = new Discord.Client();
  client.login(process.env.APP_TOKEN);
  client.commands = loadCommands();
  [client.games, client.gamesList] = loadGames();
  client.commandsHelp = prepareCommandsHelp(client.commands); // generates full help message
  client.cache = { audioUtils: new Collection() };

  initCooldownManager(client);
  loadEventListeners(client, initRedis());

  client.setMaxListeners(2048);
};

// eslint-disable-next-line no-console
main().catch((err) => console.log(err));
