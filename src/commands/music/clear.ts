import { PREFIX } from "../../constants";
import { lightErrorEmbed, withAuthorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { sendNotInGuild } from "./utils/embeds";

const clear: Command = {
  name: "clear",
  description: "Clears all tracks from the queue.",
  argsCount: 0,
  category: "Music",
  usage: `${PREFIX}clear`,
  execute(message) {
    const { guild, client, channel, author } = message;
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }

    // TODO check if there is a dispatcher
    const queue = client.audioQueues.get(guild.id);
    if (!queue) {
      channel.send(lightErrorEmbed("Queue is already empty."));
      return;
    }

    if (queue.dispatcher) {
      queue.queue = [];
      queue.dispatcher.end();
    } else {
      client.audioQueues.delete(guild.id);
    }

    channel.send(withAuthorEmbed(author).setTitle("Queue has been cleared!"));
  },
};

export default clear;
