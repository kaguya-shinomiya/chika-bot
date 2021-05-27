import { PREFIX } from "../../constants";
import { Command } from "../../types/command";
import { isWithinQueueLength } from "./utils/checks";
import { sendAddedToQueue, sendNotInGuild, sendNoVideo } from "./utils/embeds";
import { checkValidSearch, extractVideoData } from "./utils/youtube";

const addd: Command = {
  name: "addd",
  argsCount: -2,
  category: "Music",
  usage: `${PREFIX}addd <url|search_string>`,
  description: "Inserts a track to the front of the queue.",
  async execute(message, args) {
    const { client, channel, guild, author } = message;
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }

    const videoInfo = await checkValidSearch(args);
    if (!videoInfo) {
      sendNoVideo(args.join(" "), channel);
      return;
    }

    const [link, videoData] = videoInfo;
    const queue = client.audioQueues.get(guild.id);
    if (!queue) {
      client.audioQueues.set(guild.id, {
        queue: [
          {
            link,
            ...extractVideoData(videoData),
          },
        ],
      });
    } else {
      const canAdd = isWithinQueueLength(channel, queue);
      if (!canAdd) return;

      queue.queue.unshift({ link, ...extractVideoData(videoData) });
    }
    sendAddedToQueue({ videoData, channel, author, link });
  },
};

export default addd;
