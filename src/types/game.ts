import { Message } from "discord.js";

export type nextFn = (...args: any[]) => void;
// eslint-disable-next-line no-shadow
export enum GameType {
  Single,
  Versus,
  Multi,
}
export type OpponentResponse = "timeout" | "rejected" | "accepted";

export abstract class Game {
  static title: string;

  static type: GameType;

  static pregame?(message: Message): void;
}
