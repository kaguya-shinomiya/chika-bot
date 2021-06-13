import { queue } from "../../data/redisClient";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command, CommandCategory } from "../../types/command";
import { sendMusicOnlyInGuild, sendRepeat } from "./utils/embeds";

const repeat = new Command({
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
});

export default repeat;
