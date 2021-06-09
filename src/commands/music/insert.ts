import { PREFIX } from "../../constants";
import { Command } from "../../types/command";
import {
  sendAddedToQueue,
  sendMusicOnlyInGuild,
  sendNoVideo,
} from "./utils/embeds";
import { validateArgs } from "./utils/youtube";

const insert: Command = {
  name: "insert",
  aliases: ["addd"],
  argsCount: -2,
  category: "Music",
  usage: `${PREFIX}addd <url|search_string>`,
  description: "Inserts a track to the front of the queue.",
  async execute(message, args) {
    const { channel, guild, author, client } = message;
    if (!guild) {
      sendMusicOnlyInGuild(channel);
      return;
    }

    const videoData = await validateArgs(args);
    if (!videoData) {
      sendNoVideo(channel, args.join(" "));
      return;
    }

    client.redisManager.tracks.lpush(guild.id, JSON.stringify(videoData));
    sendAddedToQueue(channel, { videoData, author });
  },
};

export default insert;
