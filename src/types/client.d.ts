import Discord from "discord.js";
import { Command } from "./command";
import { Game } from "./game";
import { AudioUtils } from "./queue";

interface DiscordClientCache {
  audioUtils: Discord.Collection<string, AudioUtils>;
}

declare module "discord.js" {
  export interface Client {
    commands: Discord.Collection<string, Command>;
    games: Discord.Collection<string, Game>;
    gamesList: string[];
    commandsHelp: Discord.MessageEmbed;

    cache: DiscordClientCache;
  }
}
