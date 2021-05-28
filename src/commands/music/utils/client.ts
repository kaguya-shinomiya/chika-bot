import { Client, VoiceChannel, VoiceConnection } from "discord.js";
import { Queue } from "../../../types/queue";

export const createQueueIfNotExists = (
  client: Client,
  guildID: string
): Queue => {
  let queue;
  queue = client.audioQueues.get(guildID);
  if (!queue) {
    queue = client.audioQueues.set(guildID, { queue: [] }).get(guildID)!;
  }
  return queue;
};

export const tryToConnect = async (
  channel: VoiceChannel
): Promise<VoiceConnection | null> =>
  channel
    .join()
    .then((conn) => conn)
    .catch(() => null);
