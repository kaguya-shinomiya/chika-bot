import cluster from "cluster";
import Discord from "discord.js";
import { fullHelpEmbed } from "./init/fullHelpEmbed";
import { initialClientCache } from "./init/initialClientCache";
import { loadCommands } from "./init/loadCommands";
import { loadEventListeners } from "./init/loadEventListeners";

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

// experimental
if (cluster.isMaster) {
  cluster.fork();
  cluster.on("exit", (worker) => {
    // eslint-disable-next-line no-console
    console.error(`worker ${worker.process.pid} exited unexpectedly`);
    cluster.fork();
  });
} else {
  // eslint-disable-next-line no-console
  main().catch((err) => console.error(err));
}
