import { DEFAULT_PREFIX } from "../../shared/constants";
import { lightErrorEmbed, sendNotInGuild } from "../../shared/embeds";
import { Command, CommandCategory } from "../../types/command";

export const boot: Command = {
  name: "boot",
  description: "Boot Chika from the voice channel. Queue is not cleared.",
  argsCount: 0,
  category: CommandCategory.music,
  usage: `${DEFAULT_PREFIX}boot`,
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

export default boot;
