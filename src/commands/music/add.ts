import { PREFIX } from "../../constants";
import { Command } from "../../types/command";
import { sendAddedToQueue, sendNoVideo } from "./utils/embeds";
import { checkValidSearch, extractVideoData } from "./utils/youtube";

const add: Command = {
  name: "add",
  argsCount: -2,
  category: "Music",
  usage: `${PREFIX}add <url|search_string>`,
  description: "Add a song to the queue.",
  async execute(message, args) {
    const { client, channel, guild } = message;
    if (!guild) return;

    const videoInfo = await checkValidSearch(args);
    if (!videoInfo) {
      sendNoVideo(args.join(" "), channel);
      return;
    }
    if (!videoInfo) return;
    const [link, videoData] = videoInfo;
    const queue = client.audioQueues.get(channel.id);
    if (!queue) {
      client.audioQueues.set(channel.id, {
        queue: [
          {
            link,
            ...extractVideoData(videoData),
          },
        ],
      });
    } else {
      queue.queue.unshift({ link, ...extractVideoData(videoData) });
    }
    sendAddedToQueue(videoData, channel);
  },
};

export default add;
