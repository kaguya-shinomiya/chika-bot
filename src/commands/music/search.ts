import { lightErrorEmbed, sendNotInGuild } from "../../shared/embeds";
import { Command, CommandCategory, PartialCommand } from "../../types/command";
import { setCooldown } from "../../utils/cooldownManager";
import { genUsage } from "../../utils/genUsage";
import { sendSearchResults } from "./utils/embeds";
import { createResultSelectListener } from "./utils/listener";
import { searchVideo } from "./utils/youtube";

const search: PartialCommand = {
  name: "search",
  description: "Search for a track on YouTube",
  args: [{ name: "search_string", multi: true }],
  category: CommandCategory.music,
  channelCooldown: 15000,

  async execute(message, args) {
    const { channel, client, guild } = message;
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }

    setCooldown(channel.id, this.name, this.channelCooldown!);

    const results = await searchVideo(args.join(" "));
    if (!results) {
      channel.send(lightErrorEmbed("Your search received no results."));
      return;
    }

    sendSearchResults(channel, results);

    const resultSelectListener = createResultSelectListener(results, {
      channelId: channel.id,
      guildId: guild.id,
    });
    const timeoutCallback = () => {
      client.removeListener("message", resultSelectListener);
    };
    client.on("message", resultSelectListener);
    client.setTimeout(timeoutCallback, this.channelCooldown!);
  },
};

genUsage(search);
export default search as Command;
