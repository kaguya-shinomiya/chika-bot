import { StreamDispatcher } from "discord.js";

export interface QueueItem {
  link: string;
  title: string;
  thumbnailLink: string;
}
export interface Queue {
  dispatcher?: StreamDispatcher;
  queue: QueueItem[];
}
