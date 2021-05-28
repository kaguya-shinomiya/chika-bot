import { Client } from "discord.js";
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
