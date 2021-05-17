import Discord from "discord.js";
import dotenv from "dotenv-safe";
import { commandList } from "./commands";
import { PREFIX } from "./constants";
import { Command } from "./types/command";
dotenv.config();

const client = new Discord.Client();
const commands = new Discord.Collection<string, Command>();
commandList.forEach((command) => commands.set(command.name, command));

client.once("ready", () => {
  console.log("ready!");
});

client.on("message", (message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;
  const args = message.content.split(/ +/);
  const sentCommand = args.shift()?.toLowerCase().replace(PREFIX, "");
  if (!sentCommand) return;
  const command = commands.get(sentCommand);
  if (!command) {
    return message.channel.send("I didn't understand that command.");
  }

  try {
    command.execute(message, args);
  } catch (err) {
    console.log(err);
    return message.channel.send(
      "I ran into an error while processing your request."
    );
  }
});

client.login(process.env.APP_TOKEN);
