import { Client, Guild, VoiceConnection } from "discord.js";
import { GenericChannel } from "../../../types/command";
import { sendNowPlaying } from "./embeds";
import { playFromYt } from "./youtube";

interface CreateFinishListenerProps {
  connection: VoiceConnection;
  channel: GenericChannel;
  guild: Guild;
  client: Client;
}

export const createFinishListener = ({
  connection,
  channel,
  guild,
  client,
}: CreateFinishListenerProps) => {
  const songFinishListener = () => {
    const nowQueue = client.audioQueues.get(guild.id)!;
    if (!nowQueue.queue.length) {
      nowQueue.dispatcher!.destroy();
      connection.disconnect();
      client.audioQueues.delete(guild.id);
      return;
    }

    nowQueue.nowPlaying = nowQueue.queue.pop()!;
    const { title, thumbnailLink, link: nextLink } = nowQueue.nowPlaying;
    sendNowPlaying(channel, {
      title,
      thumbnailLink,
    });
    nowQueue.dispatcher = playFromYt(connection, nextLink);
    nowQueue.dispatcher.on("finish", songFinishListener); // another one
    // TODO handle errors for dispatcher
  };
  return songFinishListener;
};
