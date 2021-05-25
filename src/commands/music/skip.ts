import { PREFIX } from "../../constants";
import { baseEmbed, lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { sendNotInGuild } from "./utils/embeds";

const skip: Command = {
  name: "skip",
  description: "Skip the current track.",
  usage: `${PREFIX}skip`,
  argsCount: 0,
  category: "Music",
  execute(message) {
    const { channel, guild, client } = message;
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }

    // TODO check if there is a nowPlaying
    const queue = client.audioQueues.get(channel.id);
    if (!queue?.dispatcher) {
      channel.send(lightErrorEmbed("There is no track to skip."));
      return;
    }

    const { nowPlaying, dispatcher } = queue;

    channel.send(
      baseEmbed().setDescription(`Skipping **${nowPlaying!.title}**`)
    );
    dispatcher.end();
  },
};

export default skip;
