import { PREFIX } from "../../constants";
import { Command } from "../../types/command";
import { RedisPrefix } from "../../types/redis";
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
  redis: RedisPrefix.tracks,
  async execute(message, args, redis) {
    const { channel, guild, author } = message;
    if (!guild) {
      sendMusicOnlyInGuild(channel);
      return;
    }
    const videoData = await validateArgs(args);
    if (!videoData) {
      sendNoVideo(args.join(" "), channel);
      return;
    }

    redis.rpush(guild.id, JSON.stringify(videoData));
    sendAddedToQueue({ videoData, channel, author });
  },
};

export default add;
