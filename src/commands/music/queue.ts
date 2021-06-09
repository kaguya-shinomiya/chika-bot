import { DEFAULT_PREFIX } from "../../shared/constants";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { sendMusicOnlyInGuild, sendQueue } from "./utils/embeds";
import { queue as tracks } from "../../data/redisManager";

// TODO use paginated embed for this

const queue: Command = {
  name: "queue",
  description: "Display tracks in the queue.",
  aliases: ["q"],
  argsCount: 0,
  category: "Music",
  usage: `${DEFAULT_PREFIX}queue`,
  async execute(message) {
    const { channel, client, guild } = message;
    if (!guild) {
      sendMusicOnlyInGuild(channel);
      return;
    }

    tracks.lrange(guild.id, 0, -1).then((_tracks) => {
      const audioUtils = client.cache.audioUtils.get(guild.id);
      if (_tracks.length === 0 && !audioUtils) {
        channel.send(
          lightErrorEmbed(
            "There are no tracks queued, and nothing is playing now."
          )
        );
        return;
      }
      sendQueue(channel, _tracks.map((track) => JSON.parse(track)) || [], {
        nowPlaying: audioUtils?.nowPlaying,
        isPaused: audioUtils?.dispatcher.paused,
        current: audioUtils?.dispatcher.streamTime,
      });
    });
  },
};

export default queue;
