import type { DMChannel, Message, NewsChannel, TextChannel } from "discord.js";

// eslint-disable-next-line no-shadow
export enum CommandCategory {
  fun = ":coffee: Fun",
  utility = ":satellite: Utility",
  music = ":headphones: Music",
  currency = ":moneybag: Currency",
  game = ":video_game: Game",
}

interface CommandArg {
  name: string;
  optional?: boolean;
  multi?: boolean;
}

type GenericChannel = TextChannel | DMChannel | NewsChannel;

class Command {
  name!: string;

  description!: string;

  category!: CommandCategory;

  usage!: string;

  args!: CommandArg[];

  aliases?: string[];

  channelCooldown?: number;

  userCooldown?: number;

  execute!: (message: Message, args: string[]) => Promise<void>;
}

type PartialCommand = Omit<Command, "usage">;

export type { Command, GenericChannel, CommandArg, PartialCommand };
