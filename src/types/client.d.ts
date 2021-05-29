import Discord from "discord.js";
import { Redis } from "ioredis";
import { Command } from "./command";
import { Game } from "./game";
import { GameState } from "./gameState";
import { AudioUtils, Queue } from "./queue";

interface ClientCache {
  audioQueues: Discord.Collection<string, AudioUtils>;
}

declare module "discord.js" {
  export interface Client {
    commands: Discord.Collection<string, Command>;
    games: Discord.Collection<string, typeof Game>;
    gamesList: string[];
    commandsHelp: Discord.MessageEmbed;

    cache: ClientCache;

    gameStates: Discord.Collection<string, GameState>; // the key is channel id
    audioQueues: Discord.Collection<string, Queue>; // maps guildID to a Queue
  }
}

export interface RedisPrefixed {
  defaultRedis: Redis;
  tracksRedis: Redis;
  gamesRedis: Redis;
}
