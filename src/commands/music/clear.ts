import { queue } from "../../data/redisClient";
import { lightErrorEmbed, withAuthorEmbed } from "../../shared/embeds";
import { Command, CommandCategory, PartialCommand } from "../../types/command";
import { genUsage } from "../../utils/genUsage";
import { sendMusicOnlyInGuild } from "./utils/embeds";

const clear: PartialCommand = {
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

    queue.del(guild.id).then((res) => {
      if (!res) {
        channel.send(lightErrorEmbed("Queue is already empty."));
        return;
      }
      channel.send(withAuthorEmbed(author).setTitle("Queue has been cleared."));
    });
  },
};

genUsage(clear);
export default clear as Command;
