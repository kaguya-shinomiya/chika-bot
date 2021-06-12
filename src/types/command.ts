import type { DMChannel, Message, NewsChannel, TextChannel } from "discord.js";

// eslint-disable-next-line no-shadow
export enum CommandCategory {
  FUN = ":coffee: Fun",
  UTILITY = ":satellite: Utility",
  MUSIC = ":headphones: Music",
  CURRENCY = ":moneybag: Currency",
  GAME = ":video_game: Game",
}

interface CommandArg {
  name: string;
  optional?: boolean;
  multi?: boolean;
}

type GenericChannel = TextChannel | DMChannel | NewsChannel;

interface Command {
  name: string;

  description: string;

  category: CommandCategory;

  usage: string;

  args: CommandArg[];

  aliases?: string[];

  channelCooldown?: number;

  userCooldown?: number;

  execute(message: Message, args: string[]): Promise<void>;
}

type PartialCommand = Omit<Command, "usage">;

export type { Command, GenericChannel, CommandArg, PartialCommand };
