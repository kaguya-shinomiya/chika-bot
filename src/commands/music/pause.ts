import { PREFIX } from "../../constants";
import { lightErrorEmbed, withAuthorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { sendNotInGuild, toUrlString } from "./utils/embeds";

const pause: Command = {
  name: "pause",
  aliases: ["stop"],
  description: "Pause the current playback.",
  argsCount: 0,
  usage: `${PREFIX}pause`,
  category: "Music",
  async execute(message) {
    const { client, channel, guild, author } = message;
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
    const { title, url } = queue.nowPlaying!;
    channel.send(
      withAuthorEmbed(author)
        .setTitle(`:pause_button: Paused`)
        .setDescription(toUrlString(title, url))
    );
  },
};

export default pause;
