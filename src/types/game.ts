import { Message } from "discord.js";

export type nextFn = (...args: any[]) => void;
export interface Game {
  name: string;
  type: "single" | "1v1" | "multi";
  pregame?: (message: Message, next?: nextFn) => void;
}
