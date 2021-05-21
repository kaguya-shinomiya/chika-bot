import Discord from "discord.js";
import { Command } from "./command";

declare module "discord.js" {
  export interface Client {
    commands: Discord.Collection<string, Command>; // adds commands attr to Client class
    commandsHelp: Discord.MessageEmbed;
  }
}
