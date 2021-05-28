import { Client, Guild, Message } from "discord.js";
import { GenericChannel } from "../../../types/command";
import { Queue, QueueItem } from "../../../types/queue";
import {
  sendAddedToQueue,
  sendCannotPlay,
  sendFinishedAllTracks,
  sendNowPlaying,
} from "./embeds";
import { playFromYt } from "./youtube";

interface CreateFinishListenerProps {
  channel: GenericChannel;
  guild: Guild;
  client: Client;
}

export const createFinishListener = ({
  channel,
  guild,
  client,
}: CreateFinishListenerProps) => {
  const songFinishListener = async () => {
    const nowQueue = client.audioQueues.get(guild.id)!;
    if (!nowQueue.queue.length) {
      sendFinishedAllTracks(channel);
      nowQueue.dispatcher?.destroy();
      nowQueue.connection!.disconnect();
      client.audioQueues.delete(guild.id);
      return;
    }

    nowQueue.nowPlaying = nowQueue.queue.shift()!;
    const { url, title } = nowQueue.nowPlaying;
    const dispatcher = await playFromYt(nowQueue.connection!, url);
    if (!dispatcher) {
      sendCannotPlay(title, url, channel);
      songFinishListener();
      return;
    }
    nowQueue.dispatcher = dispatcher;
    sendNowPlaying(channel, nowQueue.nowPlaying);
    nowQueue.dispatcher.on("finish", songFinishListener);
    // TODO handle errors for dispatcher
  };
  return songFinishListener;
};

interface createResultSelectListenerProps {
  maxNum: number;
  results: QueueItem[];
  queue: Queue;
  channelID: string;
}

export const createResultSelectListener = ({
  maxNum,
  results,
  queue,
  channelID,
}: createResultSelectListenerProps) => {
  const resultSelectListener = async (message: Message) => {
    const { content, channel: nowChannel, author } = message;
    if (channelID !== nowChannel.id) return;
    const index = parseInt(content, 10);
    if (Number.isNaN(index) || index > maxNum) return;

    const selectedTrack = results[index - 1];
    queue.queue.push(selectedTrack);
    sendAddedToQueue({ videoData: selectedTrack, channel: nowChannel, author });
  };

  return resultSelectListener;
};
