import Discord from "discord.js";
import { Command } from "./command";
import { Game } from "./game";
import { GameState } from "./gameState";
declare module "discord.js" {
  export interface Client {
    commands: Discord.Collection<string, Command>;
    games: Discord.Collection<string, Game>;
    gameStates: Discord.Collection<string, GameState>; // the key is a uuid
    commandsHelp: Discord.MessageEmbed;
  }
}
