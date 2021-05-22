import Discord from "discord.js";
import { Command } from "./command";
import { Game } from "./game";

declare module "discord.js" {
  export interface Client {
    commands: Discord.Collection<string, Command>;
    games: Discord.Collection<string, Game>;
    commandsHelp: Discord.MessageEmbed;
  }
}
