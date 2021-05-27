import { PREFIX } from "../../constants";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { sendNotInGuild, sendSearchResults } from "./utils/embeds";
import { createResultSelectListener } from "./utils/listener";
import { searchVideo } from "./utils/youtube";

// TODO send add message to add
export const search: Command = {
  name: "search",
  description: "Search for a track on YouTube",
  argsCount: -2,
  category: "Music",
  usage: `${PREFIX}search <search_string>`,
  async execute(message, args) {
    const { channel, client, guild } = message;

    // TODO refactor to ytsr
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
    // TODO select to add to queue
    // TODO create a queue if it doesn't already exist
    let queue = client.audioQueues.get(guild.id);
    if (!queue) {
      queue = client.audioQueues.set(guild.id, { queue: [] }).get(guild.id)!;
    }
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
    client.setTimeout(timeoutCallback, 1000 * 15);
  },
};

export default search;
