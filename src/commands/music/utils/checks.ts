import { GenericChannel } from "../../../types/game";
import { Queue } from "../../../types/queue";
import { sendMaxTracksQueued } from "./embeds";

const MAX_TRACKS = 9;

export const isWithinQueueLength = (
  channel: GenericChannel,
  queue: Queue
): boolean => {
  if (queue.queue.length >= MAX_TRACKS) {
    sendMaxTracksQueued(channel);
    return false;
  }
  return true;
};
