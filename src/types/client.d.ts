import Discord from "discord.js";
import { Command } from "./command";
import { Game } from "./game";
import { GameState } from "./gameState";
import { Queue } from "./queue";

declare module "discord.js" {
  export interface Client {
    commands: Discord.Collection<string, Command>;
    games: Discord.Collection<string, typeof Game>;
    gamesList: string[];
    gameStates: Discord.Collection<string, GameState>; // the key is a uuid
    commandsHelp: Discord.MessageEmbed;
    audioQueues: Discord.Collection<string, Queue>; // maps guildID to a Queue
  }
}
