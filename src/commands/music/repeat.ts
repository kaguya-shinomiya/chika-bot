import { PREFIX } from "../../constants";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { RedisPrefix } from "../../types/redis";
import { sendMusicOnlyInGuild, sendRepeat } from "./utils/embeds";

const repeat: Command = {
  name: "repeat",
  aliases: ["rp"],
  argsCount: 0,
  category: "Music",
  usage: `${PREFIX}repeat`,
  description: "Repeats the current track once.",
  redis: RedisPrefix.tracks,
  async execute(message, _args, redis) {
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

    sendRepeat({ channel, videoData: audioUtils.nowPlaying, author });
    redis.lpush(guild.id, JSON.stringify(audioUtils.nowPlaying));
  },
};

export default repeat;
