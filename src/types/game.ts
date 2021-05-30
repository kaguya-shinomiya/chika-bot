import { Message, MessageEmbed } from "discord.js";
import { Redis } from "ioredis";

// eslint-disable-next-line no-shadow
export enum GameType {
  Single = 1,
  Versus,
  Multi,
  Indie,
}
export type OpponentResponse = "timeout" | "rejected" | "accepted";

export abstract class Game {
  abstract title: string;

  abstract displayTitle: string;

  abstract type: GameType;

  abstract pregame(message: Message, redis: Redis): void;

  abstract rules: MessageEmbed;
}
