import { Message } from "discord.js";

export type commandCategory = "Fun" | "Utility" | "Music";

export interface Command {
  name: string;
  description: string;
  category: commandCategory;
  usage: string;
  aliases?: string[];
  argsCount: number; // set to -1 for any
  execute: (message: Message, args: string[]) => void;
}
