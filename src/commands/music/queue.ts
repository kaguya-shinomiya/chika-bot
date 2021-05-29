import { PREFIX } from "../../constants";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { RedisPrefix } from "../../types/redis";
import { sendMusicOnlyInGuild, sendQueued } from "./utils/embeds";

const queue: Command = {
  name: "queue",
  description: "Display tracks in the queue.",
  aliases: ["q"],
  argsCount: 0,
  category: "Music",
  usage: `${PREFIX}queue`,
  redis: RedisPrefix.tracks,
  async execute(message, _args, redis) {
    const { channel, client, guild } = message;
    if (!guild) {
      sendMusicOnlyInGuild(channel);
      return;
    }

    redis.lrange(guild.id, 0, -1).then((tracks) => {
      const audioUtils = client.cache.audioUtils.get(guild.id);
      if (!tracks && !audioUtils) {
        channel.send(
          lightErrorEmbed(
            "There are no tracks queued, and nothing is playing now."
          )
        );
        return;
      }
      sendQueued({
        channel,
        tracks: tracks.map((track) => JSON.parse(track)),
        nowPlaying: audioUtils?.nowPlaying,
        isPaused: audioUtils?.dispatcher.paused,
        current: audioUtils?.dispatcher.streamTime,
      });
    });
  },
};

export default queue;
