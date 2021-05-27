import { PREFIX } from "../../constants";
import { Command } from "../../types/command";
import { sendAddedToQueue, sendNotInGuild, sendNoVideo } from "./utils/embeds";
import { validateArgs } from "./utils/youtube";

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
      queue.queue.push(videoData);
    }
    sendAddedToQueue({ videoData, channel, author });
  },
};

export default add;
