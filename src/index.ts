import Discord from "discord.js";
import { Collection } from "discord.js";
import dotenv from "dotenv-safe";
import { loadCommands } from "./utils/loadCommands";
import { loadEventListeners } from "./utils/loadEventListeners";
import { loadGames } from "./utils/loadGames";
import { prepareCommandsHelp } from "./utils/prepareCommandsHelp";
dotenv.config();

// TODO look into Redis for session-related things, or we can store everything on the client
// TODO look into making some of these setup functions asynchronous

const main = async () => {
  const client = new Discord.Client();
  client.login(process.env.APP_TOKEN);
  client.commands = loadCommands();
  client.games = loadGames();
  client.gameState = new Collection(); // initialize an empty gameState instance
  client.commandsHelp = prepareCommandsHelp(client.commands); // generates full help message
  loadEventListeners(client);
};

main().catch((err) => console.log(err));
