import { lightErrorEmbed } from "../../shared/embeds";
import { Command, CommandCategory, PartialCommand } from "../../types/command";
import { genUsage } from "../../utils/genUsage";
import { sendMusicOnlyInGuild, sendNowPlaying } from "./utils/embeds";

const nowPlaying: PartialCommand = {
  name: "now-playing",
  aliases: ["np"],
  args: [],
  description: "Show the currently playing track.",
  category: CommandCategory.music,

  async execute(message) {
    const { guild, client, channel } = message;
    if (!guild) {
      sendMusicOnlyInGuild(channel);
      return;
    }

    const audioUtils = client.cache.audioUtils.get(guild.id);
    if (!audioUtils?.nowPlaying) {
      channel.send(lightErrorEmbed("The sound of silence."));
      return;
    }

    sendNowPlaying(channel, audioUtils.nowPlaying, {
      streamTime: audioUtils.dispatcher.streamTime,
    });
  },
};

genUsage(nowPlaying);
export default nowPlaying as Command;
