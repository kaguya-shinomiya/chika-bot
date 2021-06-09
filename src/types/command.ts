import type { DMChannel, Message, NewsChannel, TextChannel } from "discord.js";
import { RedisPrefixed } from "./redis";

type commandCategory = "Fun" | "Utility" | "Music" | "Currency";
type GenericChannel = TextChannel | DMChannel | NewsChannel;

class Command {
  name!: string;

  description!: string;

  category!: commandCategory;

  usage!: string;

  argsCount!: number; // set to -1 for any, -2 for at least one

  aliases?: string[];

  channelCooldown?: number;

  userCooldown?: number;

  execute!: (message: Message, args: string[], redis: RedisPrefixed) => void;
}

export type { Command, commandCategory, GenericChannel };
