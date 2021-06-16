/* eslint-disable import/first */
require("dotenv-safe").config();

import Discord from "discord.js";
import { genFullHelpEmbed } from "./init/fullHelpEmbed";
import { initialClientCache } from "./init/initialClientCache";
import { loadCommands } from "./init/loadCommands";
import { loadEventListeners } from "./init/loadEventListeners";
import { seedCommands } from "./init/seedCommands";

const main = async () => {
  const client = new Discord.Client();
  client.login(process.env.APP_TOKEN);

  client.commands = loadCommands();
  client.commandsHelp = genFullHelpEmbed(client.commands); // generates full help message
  seedCommands(client.commands);

  client.cache = initialClientCache;

  loadEventListeners(client);

  client.setMaxListeners(2048);
};

try {
  main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    throw err;
  });
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(err);
}

// // experimental
// if (cluster.isMaster) {
//   cluster.fork();
//   cluster.on("exit", (worker) => {
//     // eslint-disable-next-line no-console
//     console.error(`worker ${worker.process.pid} exited unexpectedly`);
//     cluster.fork();
//   });
// } else {
//   // eslint-disable-next-line no-console
//   main().catch((err) => console.error(err));
// }
