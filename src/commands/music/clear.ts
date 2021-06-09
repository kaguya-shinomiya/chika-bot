import { PREFIX } from "../../constants";
import { lightErrorEmbed, withAuthorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { sendMusicOnlyInGuild } from "./utils/embeds";

const clear: Command = {
  name: "clear",
  description: "Clears all tracks from the queue.",
  argsCount: 0,
  aliases: ["c"],
  category: "Music",
  usage: `${PREFIX}clear`,
  async execute(message) {
    const { guild, channel, author, client } = message;
    if (!guild) {
      sendMusicOnlyInGuild(channel);
      return;
    }

    client.redisManager.tracks.del(guild.id).then((res) => {
      if (!res) {
        channel.send(lightErrorEmbed("Queue is already empty."));
        return;
      }
      channel.send(withAuthorEmbed(author).setTitle("Queue has been cleared."));
    });
  },
};

export default clear;
