import { lightErrorEmbed, sendNotInGuild } from "../../shared/embeds";
import { Command, CommandCategory, PartialCommand } from "../../types/command";
import { genUsage } from "../../utils/genUsage";

export const boot: PartialCommand = {
  name: "boot",
  description: "Boot Chika from the voice channel. Queue is not cleared.",
  category: CommandCategory.music,
  args: [],

  async execute(message) {
    const { guild, client, channel } = message;
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }
    const audioUtils = client.cache.audioUtils.get(guild.id);
    if (!audioUtils?.connection) {
      channel.send(lightErrorEmbed(`Bruv I'm not even in a voice channel.`));
      return;
    }
    audioUtils.connection.disconnect();
    channel.send(lightErrorEmbed(`I've left the voice channel.`));
    client.cache.audioUtils.delete(guild.id);
  },
};

genUsage(boot);
export default boot as Command;
