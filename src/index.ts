/* eslint-disable import/first */
require("dotenv-safe").config();

import cluster from "cluster";
import Discord from "discord.js";
import { genFullHelpEmbed } from "./init/fullHelpEmbed";
import { initialClientCache } from "./init/initialClientCache";
import { loadCommands } from "./init/loadCommands";
import { loadEventListeners } from "./init/loadEventListeners";
import { seedCommands } from "./init/seedCommands";
import { CriticalError } from "./shared/errors";

const main = () => {
  const client = new Discord.Client();
  client.login(process.env.APP_TOKEN);

  client.commands = loadCommands();
  client.commandsHelp = genFullHelpEmbed(client.commands); // generates full help message
  seedCommands(client.commands);

  client.cache = initialClientCache;

  loadEventListeners(client);

  client.setMaxListeners(2048);
};

// try {
//   main().catch((err) => {
//     // eslint-disable-next-line no-console
//     console.error(err);
//     throw err;
//   });
// } catch (err) {
//   // eslint-disable-next-line no-console
//   console.error(err);
// }

process.on("unhandledRejection", (err) => {
  // eslint-disable-next-line no-console
  console.error(`Got an unhandledRejection Error ---> `, err);
  throw err;
});

// experimental
if (cluster.isMaster) {
  cluster.fork();
  cluster.on("exit", (worker) => {
    // eslint-disable-next-line no-console
    console.error(
      `Worker ${worker.process.pid} exited unexpectedly. Starting a new process.`
    );
    cluster.fork();
  });
} else {
  try {
    main();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    if (err instanceof CriticalError) throw err;
  }
}
