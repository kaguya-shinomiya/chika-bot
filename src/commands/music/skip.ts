import { PREFIX } from "../../constants";
import { lightErrorEmbed, withAuthorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { sendNotInGuild, toUrlString } from "./utils/embeds";

const skip: Command = {
  name: "skip",
  description: "Skip the current track.",
  usage: `${PREFIX}skip`,
  argsCount: 0,
  category: "Music",
  async execute(message) {
    const { channel, guild, client, author } = message;
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }

    const queue = client.audioQueues.get(guild.id);
    if (!queue?.dispatcher) {
      channel.send(lightErrorEmbed("There is no track to skip."));
      return;
    }

    const { nowPlaying, dispatcher } = queue;

    channel.send(
      withAuthorEmbed(author).setDescription(
        `Skipping **${toUrlString(nowPlaying!.title, nowPlaying!.url)}**`
      )
    );
    dispatcher.end();
  },
};

export default skip;
