import Discord from "discord.js";
import { initialClientCache } from "./loading/initialClientCache";
import { loadCommands } from "./loading/loadCommands";
import { loadEventListeners } from "./loading/loadEventListeners";
import { prepareCommandsHelp } from "./loading/prepareCommandsHelp";

require("dotenv-safe").config();

const main = async () => {
  const client = new Discord.Client();
  client.login(process.env.APP_TOKEN);

  client.commands = loadCommands();
  client.commandsHelp = prepareCommandsHelp(client.commands); // generates full help message

  client.cache = initialClientCache;

  loadEventListeners(client);

  client.setMaxListeners(2048);
};

// eslint-disable-next-line no-console
main().catch((err) => console.log(err));
