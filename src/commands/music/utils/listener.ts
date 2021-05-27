import { Client, Guild, VoiceConnection } from "discord.js";
import { GenericChannel } from "../../../types/command";
import { sendCannotPlay, sendNowPlaying } from "./embeds";
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
  const songFinishListener = async () => {
    const nowQueue = client.audioQueues.get(guild.id)!;
    if (!nowQueue.queue.length) {
      nowQueue.dispatcher?.destroy();
      connection.disconnect();
      client.audioQueues.delete(guild.id);
      return;
    }

    nowQueue.nowPlaying = nowQueue.queue.shift()!;
    const { url, title } = nowQueue.nowPlaying;
    try {
      nowQueue.dispatcher = await playFromYt(connection, url);
    } catch (err) {
      sendCannotPlay(title, url, channel);
      songFinishListener();
      return;
    }
    sendNowPlaying(channel, nowQueue.nowPlaying);
    nowQueue.dispatcher.on("finish", songFinishListener); // another one
    // TODO handle errors for dispatcher
  };
  return songFinishListener;
};
