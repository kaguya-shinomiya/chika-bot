import { PREFIX } from "../../constants";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { sendNotInGuild, sendRepeat } from "./utils/embeds";

const repeat: Command = {
  name: "repeat",
  aliases: ["rp"],
  argsCount: 0,
  category: "Music",
  usage: `${PREFIX}repeat`,
  description: "Repeats the current track once.",
  async execute(message) {
    const { client, channel, guild, author } = message;
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }

    const queue = client.audioQueues.get(guild.id);
    if (!queue?.dispatcher) {
      channel.send(lightErrorEmbed("Nothing is playing now!"));
      return;
    }
    sendRepeat({ channel, videoData: queue.nowPlaying!, author });
    queue.queue.unshift(queue.nowPlaying!);
  },
};

export default repeat;
