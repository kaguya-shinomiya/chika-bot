import { StreamDispatcher } from "discord.js";

interface QueueItem {
  link: string;
  title: string;
  thumbnailLink: string;
}
export interface Queue {
  dispatcher: StreamDispatcher;
  queue: QueueItem[];
}
