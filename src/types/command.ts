import { CmdCategory } from "@prisma/client";
import type { DMChannel, Message, NewsChannel, TextChannel } from "discord.js";

type GenericChannel = TextChannel | DMChannel | NewsChannel;

// eslint-disable-next-line no-shadow
// export enum CommandCategory {
//   FUN = ":coffee: Fun",
//   UTILITY = ":satellite: Utility",
//   MUSIC = ":headphones: Music",
//   CURRENCY = ":moneybag: Currency",
//   GAME = ":video_game: Game",
// }

interface CommandArg {
  name: string;
  optional?: boolean;
  multi?: boolean;
}

interface ICommand {
  name: string;
  description: string;
  category: CmdCategory;
  args: CommandArg[];
  execute(message: Message, args: string[]): Promise<void>;

  aliases?: string[];
  channelCooldown?: number;
  userCooldown?: number;
}

export class Command implements ICommand {
  name: string;

  description: string;

  category: CmdCategory;

  usage: string;

  args: CommandArg[];

  execute: (message: Message, args: string[]) => Promise<void>;

  aliases?: string[];

  channelCooldown?: number;

  userCooldown?: number;

  constructor({
    name,
    description,
    category,
    args,
    aliases,
    channelCooldown,
    userCooldown,
    execute,
  }: ICommand) {
    this.name = name;
    this.description = description;
    this.category = category;
    this.args = args;
    this.aliases = aliases;
    this.channelCooldown = channelCooldown;
    this.userCooldown = userCooldown;
    this.execute = execute;

    this.usage = this.genUsage();
  }

  genUsage(): string {
    return `${this.name} ${this.args
      .map((arg) => {
        if (!arg.optional) return `<${arg.name}>`;
        if (arg.optional && !arg.multi) return `[${arg.name}]`;
        return `[${arg.name} ...]`;
      })
      .join(" ")}`;
  }
}

export type { GenericChannel };
