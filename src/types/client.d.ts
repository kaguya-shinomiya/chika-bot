import Discord from 'discord.js';
import { Command } from './command';
import { Game } from './game';
import { AudioUtils } from './queue';

interface DiscordClientCache {
  audioUtils: Discord.Collection<string, AudioUtils>;
  inGameStates: Discord.Collection<string, string>; // map ID to game title
}

declare module 'discord.js' {
  export interface Client {
    commands: Discord.Collection<string, Command>;
    commandsHelp: Discord.MessageEmbed;

    games: Discord.Collection<string, Game>;
    gamesList: string[];

    cache: DiscordClientCache;
  }
}
