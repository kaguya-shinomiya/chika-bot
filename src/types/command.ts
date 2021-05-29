import { DMChannel, Message, NewsChannel, TextChannel } from "discord.js";
import { Redis } from "ioredis";
import { RedisPrefix } from "./redis";

export type commandCategory = "Fun" | "Utility" | "Music";
export type GenericChannel = TextChannel | DMChannel | NewsChannel;

export interface Command {
  name: string;
  description: string;
  category: commandCategory;
  usage: string;
  argsCount: number; // set to -1 for any, -2 for at least one
  aliases?: string[];
  redis: RedisPrefix;
  execute: (message: Message, args: string[], redis: Redis) => void;
}
