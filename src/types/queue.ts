import type { StreamDispatcher, VoiceConnection } from 'discord.js';

interface QueueItem {
  url: string;
  title: string;
  thumbnailURL: string;
  duration: string;
}

interface AudioUtils {
  connection: VoiceConnection;
  dispatcher: StreamDispatcher;
  nowPlaying: QueueItem;
}

export type { QueueItem, AudioUtils };
