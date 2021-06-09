import { PREFIX } from "../../constants";
import { lightErrorEmbed, sendNotInGuild } from "../../shared/embeds";
import { Command } from "../../types/command";
import { sendSearchResults } from "./utils/embeds";
import { createResultSelectListener } from "./utils/listener";
import { searchVideo } from "./utils/youtube";

export const search: Command = {
  name: "search",
  description: "Search for a track on YouTube",
  argsCount: -2,
  category: "Music",
  usage: `${PREFIX}search <search_string>`,
  channelCooldown: 15000,
  async execute(message, args) {
    const { channel, client, guild } = message;
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }

    client.cooldownManager.setCooldown(
      channel.id,
      this.name,
      this.channelCooldown!
    );

    const results = await searchVideo(args.join(" "));
    if (!results) {
      channel.send(lightErrorEmbed("Your search received no results."));
      return;
    }

    sendSearchResults(channel, results);

    const resultSelectListener = createResultSelectListener(results, {
      channelId: channel.id,
      guildId: guild.id,
      redis: client.redisManager.tracks,
    });
    const timeoutCallback = () => {
      client.removeListener("message", resultSelectListener);
    };
    client.on("message", resultSelectListener);
    client.setTimeout(timeoutCallback, this.channelCooldown!);
  },
};

export default search;
