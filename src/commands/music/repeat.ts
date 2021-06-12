import { queue } from "../../data/redisClient";
import { lightErrorEmbed } from "../../shared/embeds";
import { CommandCategory, PartialCommand } from "../../types/command";
import { genUsage } from "../../utils/genUsage";
import { sendMusicOnlyInGuild, sendRepeat } from "./utils/embeds";

const repeat: PartialCommand = {
  name: "repeat",
  aliases: ["rp"],
  category: CommandCategory.MUSIC,
  description: "Repeats the current track once.",
  args: [],

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

genUsage(repeat);
export default repeat;
