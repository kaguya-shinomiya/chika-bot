import Discord from "discord.js";
import { initialClientCache } from "./init/initialClientCache";
import { loadCommands } from "./init/loadCommands";
import { loadEventListeners } from "./init/loadEventListeners";
import { fullHelpEmbed } from "./init/fullHelpEmbed";

require("dotenv-safe").config();

const main = async () => {
  const client = new Discord.Client();
  client.login(process.env.APP_TOKEN);

  client.commands = loadCommands();
  client.commandsHelp = fullHelpEmbed(client.commands); // generates full help message

  client.cache = initialClientCache;

  loadEventListeners(client);

  client.setMaxListeners(2048);
};

// eslint-disable-next-line no-console
main().catch((err) => console.log(err));
