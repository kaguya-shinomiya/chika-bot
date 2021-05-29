import { StreamDispatcher, VoiceConnection } from "discord.js";

export interface QueueItem {
  url: string;
  title: string;
  thumbnailURL: string;
  duration: string;
}
export interface Queue {
  connection?: VoiceConnection;
  dispatcher?: StreamDispatcher;
  nowPlaying?: QueueItem;
  queue: QueueItem[];
}

export interface AudioUtils {
  connection?: VoiceConnection;
  dispatcher?: StreamDispatcher;
}
