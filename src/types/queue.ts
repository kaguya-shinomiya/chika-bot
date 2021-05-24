import { StreamDispatcher } from "discord.js";

export interface Queue {
  dispatcher: StreamDispatcher;
  queue: string[];
}
