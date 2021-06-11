import type { DMChannel, Message, NewsChannel, TextChannel } from "discord.js";

// eslint-disable-next-line no-shadow
export enum CommandCategory {
  fun = ":coffee: Fun",
  utility = ":satellite: Utility",
  music = ":headphones: Music",
  currency = ":moneybag: Currency",
  game = ":video_game: Game",
}

// type commandCategory = "Fun" | "Utility" | "Music" | "Currency" | "Game";
type GenericChannel = TextChannel | DMChannel | NewsChannel;

class Command {
  name!: string;

  description!: string;

  category!: CommandCategory;

  usage!: string;

  argsCount!: number; // set to -1 for any, -2 for at least one

  aliases?: string[];

  channelCooldown?: number;

  userCooldown?: number;

  execute!: (message: Message, args: string[]) => Promise<void>;
}

export type { Command, GenericChannel };
