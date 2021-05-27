import { StreamDispatcher } from "discord.js";

export interface QueueItem {
  url: string;
  title: string;
  thumbnailURL: string;
  duration: string;
}
export interface Queue {
  dispatcher?: StreamDispatcher;
  nowPlaying?: QueueItem;
  queue: QueueItem[];
}
