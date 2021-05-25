import Discord, { Collection } from "discord.js";
import dotenv from "dotenv-safe";
import { loadCommands } from "./utils/loadCommands";
import { loadEventListeners } from "./utils/loadEventListeners";
import { loadGames } from "./utils/loadGames";
import { prepareCommandsHelp } from "./utils/prepareCommandsHelp";

dotenv.config();

// TODO look into Redis for session-related things, or we can store everything on the client

const main = async () => {
  const client = new Discord.Client();
  client.login(process.env.APP_TOKEN);
  client.commands = loadCommands();
  client.games = loadGames();
  client.gameStates = new Collection(); // initialize an empty gameState instance
  client.commandsHelp = prepareCommandsHelp(client.commands); // generates full help message
  client.audioQueues = new Collection();
  loadEventListeners(client);
};

// eslint-disable-next-line no-console
main().catch((err) => console.log(err));
