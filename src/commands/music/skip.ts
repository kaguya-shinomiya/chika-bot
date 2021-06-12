import { lightErrorEmbed, withAuthorEmbed } from "../../shared/embeds";
import { Command, CommandCategory, PartialCommand } from "../../types/command";
import { genUsage } from "../../utils/genUsage";
import { sendMusicOnlyInGuild, toUrlString } from "./utils/embeds";
import { createFinishListener } from "./utils/listener";

const skip: PartialCommand = {
  name: "skip",
  description: "Skip the current track.",
  args: [],
  category: CommandCategory.music,

  async execute(message) {
    const { channel, guild, client, author } = message;
    if (!guild) {
      sendMusicOnlyInGuild(channel);
      return;
    }
    const audioUtils = client.cache.audioUtils.get(guild.id);
    if (!audioUtils) {
      channel.send(lightErrorEmbed("There is no track to skip."));
      return;
    }
    channel.send(
      withAuthorEmbed(author).setDescription(
        `Skipping **${toUrlString(
          audioUtils.nowPlaying.title,
          audioUtils.nowPlaying.url,
          40
        )}**`
      )
    );
    if (!audioUtils.dispatcher.paused) {
      audioUtils.dispatcher.end();
      return;
    }

    // a paused track cannot emit 'finish' for some reason
    // we'll do this manually
    createFinishListener(guild, {
      channel,
      client,
    })();
  },
};

genUsage(skip);
export default skip as Command;
