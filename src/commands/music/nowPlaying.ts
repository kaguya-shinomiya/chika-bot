import { lightErrorEmbed } from "../../shared/embeds";
import { Command, CommandCategory } from "../../types/command";
import { sendMusicOnlyInGuild, sendNowPlaying } from "./utils/embeds";

const nowPlaying = new Command({
  name: "now-playing",
  aliases: ["np"],
  args: [],
  description: "Show the currently playing track.",
  category: CommandCategory.MUSIC,

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
});

export default nowPlaying;
