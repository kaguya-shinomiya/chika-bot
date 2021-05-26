import { PREFIX } from "../../constants";
import { baseEmbed, lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { sendNotInGuild } from "./utils/embeds";

const pause: Command = {
  name: "pause",
  aliases: ["stop"],
  description: "Pause the current playback.",
  argsCount: 0,
  usage: `${PREFIX}pause`,
  category: "Music",
  execute(message) {
    const { client, channel, guild } = message;
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }

    const queue = client.audioQueues.get(guild.id);
    if (!queue?.dispatcher) {
      channel.send(
        lightErrorEmbed("There isn't anything playing right now...")
      );
      return;
    }
    if (queue.dispatcher.paused) {
      channel.send(lightErrorEmbed("Playback is already paused!"));
      return;
    }

    queue.dispatcher.pause();
    channel.send(
      baseEmbed()
        .setTitle("Track Paused")
        .setDescription(queue.nowPlaying!.title)
        .setThumbnail(queue.nowPlaying!.thumbnailLink)
    );
  },
};

export default pause;
