import { PREFIX } from "../../types/constants";
import { lightErrorEmbed, withAuthorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { sendMusicOnlyInGuild, trackLinkAndDuration } from "./utils/embeds";

const resume: Command = {
  name: "resume",
  argsCount: 0,
  category: "Music",
  description: "Resume playback.",
  usage: `${PREFIX}resume`,
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

export default resume;
