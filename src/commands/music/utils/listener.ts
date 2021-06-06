import { Client, Guild, Message } from "discord.js";
import { Redis } from "ioredis";
import { GenericChannel } from "../../../types/command";
import { QueueItem } from "../../../types/queue";
import { sendAddedToQueue, sendFinishedAllTracks } from "./embeds";
import { playThis } from "./youtube";

interface createFinishListenerParams {
  channel: GenericChannel;
  client: Client;
  redis: Redis;
}

export function createFinishListener(
  guild: Guild,
  { channel, client, redis }: createFinishListenerParams
) {
  const onFinish = async () => {
    const audioUtils = client.cache.audioUtils.get(guild.id)!;
    if (!audioUtils) return;
    redis
      .lpop(guild.id)
      .then(async (res) => {
        if (!res) {
          sendFinishedAllTracks(channel);
          audioUtils.dispatcher.destroy();
          audioUtils.connection.disconnect();
          return;
        }
        const nextData = JSON.parse(res) as QueueItem;
        playThis(audioUtils.connection, nextData, {
          channel,
          client,
          guildId: guild.id,
          onFinish,
        });
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.log(err));
  };
  return onFinish;
}

interface createResultSelectListenerParams {
  channelId: string;
  guildId: string;
  redis: Redis;
}

export const createResultSelectListener = (
  results: QueueItem[],
  { redis, channelId, guildId }: createResultSelectListenerParams
) => {
  const resultSelectListener = async (message: Message) => {
    const { content, channel, author } = message;
    if (channelId !== channel.id) return;
    const index = parseInt(content, 10);
    if (Number.isNaN(index) || index > results.length) return;

    const selectedTrack = results[index - 1];
    redis.rpush(guildId, JSON.stringify(selectedTrack));
    sendAddedToQueue(channel, { videoData: selectedTrack, author });
  };

  return resultSelectListener;
};
