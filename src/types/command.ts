import type { DMChannel, Message, NewsChannel, TextChannel } from "discord.js";
import type { Redis } from "ioredis";
import { RedisPrefix } from "./redis";

type commandCategory = "Fun" | "Utility" | "Music";
type GenericChannel = TextChannel | DMChannel | NewsChannel;

class Command {
  name!: string;

  description!: string;

  category!: commandCategory;

  usage!: string;

  argsCount!: number; // set to -1 for any, -2 for at least one

  aliases?: string[];

  redis!: RedisPrefix;

  channelCooldown?: number;

  userCooldown?: number;

  execute!: (message: Message, args: string[], redis: Redis) => void;
}

export type { Command, commandCategory, GenericChannel };
