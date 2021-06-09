import { DEFAULT_PREFIX } from "../../shared/constants";
import { queue } from "../../data/redisManager";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { sendMusicOnlyInGuild, sendRepeat } from "./utils/embeds";

const repeat: Command = {
  name: "repeat",
  aliases: ["rp"],
  argsCount: 0,
  category: "Music",
  usage: `${DEFAULT_PREFIX}repeat`,
  description: "Repeats the current track once.",
  async execute(message) {
    const { client, channel, guild, author } = message;
    if (!guild) {
      sendMusicOnlyInGuild(channel);
      return;
    }
    const audioUtils = client.cache.audioUtils.get(guild.id);
    if (!audioUtils) {
      channel.send(lightErrorEmbed("Nothing is playing now!"));
      return;
    }

    sendRepeat(channel, { videoData: audioUtils.nowPlaying, author });
    queue.lpush(guild.id, JSON.stringify(audioUtils.nowPlaying));
  },
};

export default repeat;
