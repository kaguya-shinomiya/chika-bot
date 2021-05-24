import { TextChannel, DMChannel, NewsChannel } from "discord.js";
import { Message } from "discord.js";

export type nextFn = (...args: any[]) => void;
export type gameType = "single" | "1v1" | "multi";
export type OpponentResponse = "timeout" | "rejected" | "accepted";
export type GenericChannel = TextChannel | DMChannel | NewsChannel;

export class Game {
  name: string;
  type: gameType;

  pregame?(_message: Message) {}

  constructor(name: string, type: gameType) {
    this.name = name;
    this.type = type;
  }
}
