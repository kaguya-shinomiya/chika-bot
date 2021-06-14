import { redisQueue } from "../../data/redisClient";
import { lightErrorEmbed, withAuthorEmbed } from "../../shared/embeds";
import { Command, CommandCategory } from "../../types/command";
import { sendMusicOnlyInGuild } from "./utils/embeds";

const clear = new Command({
  name: "clear",
  description: "Clears all tracks from the queue.",
  aliases: ["c"],
  category: CommandCategory.MUSIC,
  args: [],

  async execute(message) {
    const { guild, channel, author } = message;
    if (!guild) {
      sendMusicOnlyInGuild(channel);
      return;
    }

    redisQueue.del(guild.id).then((res) => {
      if (!res) {
        channel.send(lightErrorEmbed("Queue is already empty."));
        return;
      }
      channel.send(withAuthorEmbed(author).setTitle("Queue has been cleared."));
    });
  },
});

export default clear;
