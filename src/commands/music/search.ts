import { PREFIX } from "../../constants";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { sendNotInGuild, sendSearchResults } from "./utils/embeds";
import { createResultSelectListener } from "./utils/listener";
import { createQueueIfNotExists } from "./utils/client";
import { searchVideo } from "./utils/youtube";

const SEARCH_COOLDOWN = 1000 * 10;

// TODO add a cooldown for this

export const search: Command = {
  name: "search",
  description: "Search for a track on YouTube",
  argsCount: -2,
  category: "Music",
  usage: `${PREFIX}search <search_string>`,
  async execute(message, args) {
    const { channel, client, guild } = message;

    const results = await searchVideo(args.join(" "));
    if (!results) {
      channel.send(lightErrorEmbed("Your search received no results."));
      return;
    }

    sendSearchResults(results, channel);
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }
    const queue = createQueueIfNotExists(client, guild.id);
    const resultSelectListener = createResultSelectListener({
      maxNum: results.length,
      results,
      queue,
      channelID: channel.id,
    });
    const timeoutCallback = () => {
      client.removeListener("message", resultSelectListener);
      if (queue?.queue.length === 0) {
        client.audioQueues.delete(guild.id);
      }
    };

    client.on("message", resultSelectListener);
    client.setTimeout(timeoutCallback, SEARCH_COOLDOWN);
  },
};

export default search;
