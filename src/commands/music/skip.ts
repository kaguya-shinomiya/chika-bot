import { PREFIX } from "../../constants";
import { lightErrorEmbed, withAuthorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { sendMusicOnlyInGuild, toUrlString } from "./utils/embeds";
import { createFinishListener } from "./utils/listener";

const skip: Command = {
  name: "skip",
  description: "Skip the current track.",
  usage: `${PREFIX}skip`,
  argsCount: 0,
  category: "Music",
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

export default skip;
