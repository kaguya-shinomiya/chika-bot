import { PREFIX } from "../../constants";
import { getSdk, MediaType } from "../../generated/graphql";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { RedisPrefix } from "../../types/redis";
import { genAnimeInfoEmbed } from "./embeds/animeInfoEmbed";
import { client } from "./graphql/aniListClient";

export const anime: Command = {
  name: "anime",
  description: "Look up info for one anime.",
  argsCount: -2,
  category: "Utility",
  redis: RedisPrefix.default,
  usage: `${PREFIX}anime <anime_title>`,
  async execute(message, args) {
    const { channel } = message;
    const search = args.join(" ");

    const sdk = getSdk(client);
    const result = await sdk.SearchAnime({ search, type: MediaType.Anime });

    if (!result.Media) {
      channel.send(
        lightErrorEmbed(`I couldn't find any info on **${search}**.`)
      );
      return;
    }

    const {
      averageScore,
      coverImage,
      description,
      duration,
      episodes,
      genres,
      status,
      season,
      seasonYear,
      title,
    } = result.Media;

    channel.send(
      genAnimeInfoEmbed({
        coverImage: coverImage?.medium,
        title: title?.userPreferred,
        description: description!,
        episodes,
        status,
        genres,
        duration,
        averageScore,
        season,
        seasonYear,
      })
    );
  },
};

export default anime;
