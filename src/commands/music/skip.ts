import { PREFIX } from "../../constants";
import { lightErrorEmbed, withAuthorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { RedisPrefix } from "../../types/redis";
import { sendMusicOnlyInGuild, toUrlString } from "./utils/embeds";

const skip: Command = {
  name: "skip",
  description: "Skip the current track.",
  usage: `${PREFIX}skip`,
  argsCount: 0,
  category: "Music",
  redis: RedisPrefix.tracks,
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
    audioUtils.dispatcher.end();
  },
};

export default skip;
