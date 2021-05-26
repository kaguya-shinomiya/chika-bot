import { PREFIX } from "../../constants";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { sendSearchResults } from "./utils/embeds";
import { searchVideo } from "./utils/youtube";

export const search: Command = {
  name: "search",
  description: "Search for a track on YouTube",
  argsCount: -2,
  category: "Music",
  usage: `${PREFIX}search <search_string>`,
  async execute(message, args) {
    const { channel } = message;

    const results = (await searchVideo(args.join(" "), 5)).items;
    if (results.length === 0) {
      channel.send(lightErrorEmbed("Your search received no results."));
      return;
    }
    sendSearchResults(results, channel);
  },
};

export default search;
