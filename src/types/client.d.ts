import Discord from "discord.js";
import { Ok } from "ioredis";
import { Command } from "./command";
import { Game } from "./game";
import { AudioUtils } from "./queue";

interface CooldownManager {
  setCooldown: (
    id: string,
    command: string,
    time: number
  ) => Promise<Ok | null>;
  getCooldown: (id: string, command: string) => Promise<number>; // returns cooldown time, or 0
}

interface DiscordClientCache {
  audioUtils: Discord.Collection<string, AudioUtils>;
}

declare module "discord.js" {
  export interface Client {
    commands: Discord.Collection<string, Command>;
    commandsHelp: Discord.MessageEmbed;

    games: Discord.Collection<string, Game>;
    gamesList: string[];

    cooldownManager: CooldownManager;

    cache: DiscordClientCache;
  }
}
