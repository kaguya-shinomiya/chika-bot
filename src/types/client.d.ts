import Discord from "discord.js";
import { Shiritori } from "../games/shiritori/shiritori";
import { Command } from "./command";
import { GameState } from "./gameState";
import { Queue } from "./queue";

export type GenericGame = Shiritori;

declare module "discord.js" {
  export interface Client {
    commands: Discord.Collection<string, Command>;
    games: Discord.Collection<string, GenericGame>;
    gameStates: Discord.Collection<string, GameState>; // the key is a uuid
    commandsHelp: Discord.MessageEmbed;
    audioQueues: Discord.Collection<string, Queue>; // maps channelID to a Queue
  }
}
