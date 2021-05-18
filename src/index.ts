import Discord from "discord.js";
import dotenv from "dotenv-safe";
import { PREFIX, PREFIX_RE } from "./constants";
import { Command } from "@customTypes/command";
import { getCommands } from "./utils/getCommands";
dotenv.config();

declare module "discord.js" {
  export interface Client {
    commands: Discord.Collection<string, Command>; // adds commands attr to Client class
  }
}

const client = new Discord.Client();
client.commands = getCommands();

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
    return message.channel.send("I didn't understand that command.");
  }

  console.log(`Executing ${command.name} command...`);
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
