import { PREFIX } from "../../constants";
import { Command } from "../../types/command";
import { isWithinQueueLength } from "./utils/checks";
import { sendAddedToQueue, sendNotInGuild, sendNoVideo } from "./utils/embeds";
import { checkValidSearch, extractVideoData } from "./utils/youtube";

const add: Command = {
  name: "add",
  argsCount: -2,
  category: "Music",
  usage: `${PREFIX}add <url|search_string>`,
  description: "Adds a track to the queue.",
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

      queue.queue.push({ link, ...extractVideoData(videoData) });
    }
    sendAddedToQueue({ videoData, channel, author, link });
  },
};

export default add;
