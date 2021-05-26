import { Client, VoiceConnection } from "discord.js";
import ytdl from "ytdl-core";
import { GenericChannel } from "../../../types/command";
import { sendNowPlaying } from "./embeds";

interface CreateFinishListenerProps {
  connection: VoiceConnection;
  channel: GenericChannel;
  client: Client;
}

export const createFinishListener = ({
  connection,
  channel,
  client,
}: CreateFinishListenerProps) => {
  const songFinishListener = () => {
    const nowQueue = client.audioQueues.get(channel.id)!;
    if (!nowQueue.queue.length) {
      nowQueue.dispatcher!.destroy();
      connection.disconnect();
      client.audioQueues.delete(channel.id);
      return;
    }

    nowQueue.nowPlaying = nowQueue.queue.pop()!;
    const { title, thumbnailLink, link: nextLink } = nowQueue.nowPlaying;
    sendNowPlaying(channel, {
      title,
      thumbnailLink,
    });
    nowQueue.dispatcher = connection.play(
      ytdl(nextLink, { filter: "audioonly" })
    );
    nowQueue.dispatcher.on("finish", songFinishListener); // another one
    // TODO handle errors for dispatcher
  };
  return songFinishListener;
};
