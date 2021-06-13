import { queue as tracks } from "../../data/redisClient";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command, CommandCategory } from "../../types/command";
import { sendMusicOnlyInGuild, sendQueue } from "./utils/embeds";

// TODO use paginated embed for this

const queue = new Command({
  name: "queue",
  description: "Display tracks in the queue.",
  aliases: ["q"],
  args: [],
  category: CommandCategory.MUSIC,

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
});

export default queue;
