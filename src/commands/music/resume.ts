import { lightErrorEmbed, withAuthorEmbed } from "../../shared/embeds";
import { Command, CommandCategory, PartialCommand } from "../../types/command";
import { genUsage } from "../../utils/genUsage";
import { sendMusicOnlyInGuild, trackLinkAndDuration } from "./utils/embeds";

const resume: PartialCommand = {
  name: "resume",
  args: [],
  category: CommandCategory.MUSIC,
  description: "Resume playback.",

  async execute(message) {
    const { client, channel, guild, author } = message;
    if (!guild) {
      sendMusicOnlyInGuild(channel);
      return;
    }
    const audioUtils = client.cache.audioUtils.get(guild.id);
    if (!audioUtils?.dispatcher.paused) {
      channel.send(lightErrorEmbed("There is nothing to resume..."));
      return;
    }

    audioUtils.dispatcher.resume();
    const { title, url, duration } = audioUtils.nowPlaying!;
    channel.send(
      withAuthorEmbed(author)
        .setTitle(`:arrow_forward: Resumed`)
        .setDescription(trackLinkAndDuration(title, url, duration))
    );
  },
};

genUsage(resume);
export default resume as Command;
