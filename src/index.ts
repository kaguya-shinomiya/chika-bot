import Discord from "discord.js";
import dotenv from "dotenv-safe";
import { PREFIX, PREFIX_RE } from "./constants";
import { genBadArgsEmbed } from "./shared/genBadArgsEmbed";
import { genBadCommandEmbed } from "./shared/genBadCommandEmbed";
import { genericErrorEmbed } from "./shared/genericErrorEmbed";
import { loadCommands } from "./utils/loadCommands";
import { loadGames } from "./utils/loadGames";
import { prepareCommandsHelp } from "./utils/prepareCommandsHelp";
dotenv.config();

const client = new Discord.Client();
client.login(process.env.APP_TOKEN);
client.commands = loadCommands();
client.games = loadGames();
client.commandsHelp = prepareCommandsHelp(client.commands); // generates full help message

client.once("ready", () => {
  console.log("Chika bot is ready!");
});

client.on("message", (message) => {
  if (!PREFIX_RE.test(message.content) || message.author.bot) return;

  const args = message.content.split(/ +/);
  const sentCommand = args.shift()?.toLowerCase().replace(PREFIX, "");
  if (!sentCommand) return;
  const command = client.commands.find(
    (command) =>
      command.name === sentCommand || !!command.aliases?.includes(sentCommand)
  );
  if (!command) {
    message.channel.send(genBadCommandEmbed(sentCommand));
    return;
  }

  if (command.argsCount !== -1 && command.argsCount !== args.length) {
    message.channel.send(genBadArgsEmbed(command, args.length));
    return;
  }

  try {
    command.execute(message, args);
  } catch (err) {
    console.log(err);
    message.channel.send(genericErrorEmbed);
    return;
  }
});
