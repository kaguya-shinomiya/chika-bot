import { PREFIX } from "../../constants";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";

export const boot: Command = {
  name: "boot",
  description: "Boot Chika from the voice channel. Queue is not cleared.",
  argsCount: 0,
  category: "Music",
  usage: `${PREFIX}boot`,
  execute(message) {
    const { guild, client, channel } = message;
    if (!guild) {
      channel.send(
        lightErrorEmbed(`This command can only be used in a server.`)
      );
      return;
    }
    const queue = client.audioQueues.get(guild.id);
    if (!queue?.connection) {
      channel.send(lightErrorEmbed(`Bruv I'm not even in a voice channel.`));
      return;
    }
    queue.connection.disconnect();
    queue.connection = undefined;
    channel.send(lightErrorEmbed(`I've left the voice channel.`));
  },
};

export default boot;
