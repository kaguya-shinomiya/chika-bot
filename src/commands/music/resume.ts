import { PREFIX } from "../../constants";
import { baseEmbed, lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { sendNotInGuild } from "./utils/embeds";

const resume: Command = {
  name: "resume",
  argsCount: 0,
  category: "Music",
  description: "Resume playback.",
  usage: `${PREFIX}resume`,
  execute(message) {
    const { client, channel, guild } = message;
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }

    const queue = client.audioQueues.get(guild.id);

    if (!queue?.dispatcher?.paused) {
      channel.send(lightErrorEmbed("There is nothing to resume..."));
      return;
    }

    queue.dispatcher.resume();
    channel.send(
      baseEmbed()
        .setTitle("Track Resumed")
        .setDescription(queue.nowPlaying!.title)
        .setThumbnail(queue.nowPlaying!.thumbnailLink)
    );
  },
};

export default resume;
