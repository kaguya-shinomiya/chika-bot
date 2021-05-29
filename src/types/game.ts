import { Message, MessageEmbed } from "discord.js";
import { Redis } from "ioredis";

export type nextFn = (...args: any[]) => void;
// eslint-disable-next-line no-shadow
export enum GameType {
  Single = 1,
  Versus,
  Multi,
}
export type OpponentResponse = "timeout" | "rejected" | "accepted";

export abstract class Game {
  static title: string;

  static type: GameType;

  static pregame?(message: Message, redis: Redis): void;

  static rules: MessageEmbed;
}
