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
  aliases?: string[];
  argsCount: number; // set to -1 for any
  redis?: RedisPrefix;
  execute: (message: Message, args: string[], redis?: Redis) => void;
}
