import { Client, Guild, Message, VoiceConnection } from "discord.js";
import { Redis } from "ioredis";
import { GenericChannel } from "../../../types/command";
import { AudioUtils, QueueItem } from "../../../types/queue";
import {
  sendAddedToQueue,
  sendCannotPlay,
  sendFinishedAllTracks,
  sendNowPlaying,
} from "./embeds";
import { playFromYt } from "./youtube";

interface createFinishListenerParams {
  channel: GenericChannel;
  guild: Guild;
  client: Client;
  redis: Redis;
}

interface playThisParams {
  videoData: QueueItem;
  client: Client;
  connection: VoiceConnection;
  channel: GenericChannel;
  guildID: string;
  onFinish: ReturnType<typeof createFinishListener>;
}

export const playThis = async ({
  videoData,
  connection,
  client,
  channel,
  guildID,
  onFinish,
}: playThisParams): Promise<void> => {
  const dispatcher = await playFromYt(connection, videoData.url);
  if (!dispatcher) {
    sendCannotPlay(videoData.title, videoData.url, channel);
    onFinish();
    return;
  }
  sendNowPlaying({
    channel,
    streamTime: 0,
    videoData,
  });

  const newAudioUtils: AudioUtils = {
    connection,
    dispatcher,
    nowPlaying: videoData,
  };
  dispatcher.on("finish", onFinish);
  client.cache.audioUtils.set(guildID, newAudioUtils);
};

export function createFinishListener({
  channel,
  guild,
  client,
  redis,
}: createFinishListenerParams) {
  const onFinish = async () => {
    const audioUtils = client.cache.audioUtils.get(guild.id)!;
    redis.lpop(guild.id).then(async (res) => {
      if (!res) {
        sendFinishedAllTracks(channel);
        audioUtils.dispatcher.destroy();
        audioUtils.connection.disconnect();
        return;
      }
      const nextData = JSON.parse(res) as QueueItem;
      playThis({
        videoData: nextData,
        channel,
        client,
        connection: audioUtils.connection,
        guildID: guild.id,
        onFinish,
      });
    });
  };
  return onFinish;
}

interface createResultSelectListenerProps {
  results: QueueItem[];
  channelID: string;
  guildID: string;
  redis: Redis;
}

export const createResultSelectListener = ({
  results,
  redis,
  channelID,
  guildID,
}: createResultSelectListenerProps) => {
  const resultSelectListener = async (message: Message) => {
    const { content, channel, author } = message;
    if (channelID !== channel.id) return;
    const index = parseInt(content, 10);
    if (Number.isNaN(index) || index > results.length) return;

    const selectedTrack = results[index - 1];
    redis.rpush(guildID, JSON.stringify(selectedTrack));
    sendAddedToQueue({ videoData: selectedTrack, channel, author });
  };

  return resultSelectListener;
};
