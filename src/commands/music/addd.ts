import { PREFIX } from "../../constants";
import { Command } from "../../types/command";
import { sendAddedToQueue, sendNotInGuild, sendNoVideo } from "./utils/embeds";
import { validateArgs } from "./utils/youtube";

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

    const videoData = await validateArgs(args);
    if (!videoData) {
      sendNoVideo(args.join(" "), channel);
      return;
    }

    const queue = client.audioQueues.get(guild.id);
    if (!queue) {
      client.audioQueues.set(guild.id, {
        queue: [videoData],
      });
    } else {
      queue.queue.unshift(videoData);
    }
    sendAddedToQueue({ videoData, channel, author });
  },
};

export default addd;
