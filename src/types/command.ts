import { Message } from "discord.js";

export type commandCategory = "Fun" | "Utility";

export interface Command {
  name: string;
  description: string;
  category: commandCategory;
  usage: string;
  aliases?: string[];
  execute: (message: Message, args: string[]) => void;
}
