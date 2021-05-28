import { PREFIX } from "../../constants";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { sendNotInGuild, sendNowPlaying } from "./utils/embeds";

const np: Command = {
  name: "np",
  aliases: ["now-playing"],
  argsCount: 0,
  description: "Show the currently playing track.",
  category: "Music",
  usage: `${PREFIX}np`,
  async execute(message) {
    const { guild, client, channel } = message;
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }

    const queue = client.audioQueues.get(guild.id);
    if (!queue?.nowPlaying) {
      channel.send(lightErrorEmbed("The sound of silence."));
      return;
    }
    sendNowPlaying(channel, queue.nowPlaying);
  },
};

export default np;
