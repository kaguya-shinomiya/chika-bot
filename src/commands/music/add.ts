import { PREFIX } from "../../types/constants";
import { queue } from "../../data/redisManager";
import { Command } from "../../types/command";
import {
  sendAddedToQueue,
  sendMusicOnlyInGuild,
  sendNoVideo,
} from "./utils/embeds";
import { validateArgs } from "./utils/youtube";

const add: Command = {
  name: "add",
  argsCount: -2,
  category: "Music",
  usage: `${PREFIX}add <url|search_string>`,
  description: "Adds a track to the queue.",
  async execute(message, args) {
    const { channel, guild, author } = message;
    if (!guild) {
      sendMusicOnlyInGuild(channel);
      return;
    }
    const videoData = await validateArgs(args);
    if (!videoData) {
      sendNoVideo(channel, args.join(" "));
      return;
    }

    queue.rpush(guild.id, JSON.stringify(videoData));
    sendAddedToQueue(channel, { videoData, author });
  },
};

export default add;
