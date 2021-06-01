import { PREFIX } from "../../constants";
import { getSdk, MediaType } from "../../generated/graphql";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { RedisPrefix } from "../../types/redis";
import { genMangaInfoEmbed } from "./embeds/mangaInfoEmbed";
import { client } from "./graphql/aniListClient";

export const manga: Command = {
  name: "manga",
  description: "Look up info for a manga.",
  argsCount: -2,
  category: "Utility",
  redis: RedisPrefix.default,
  usage: `${PREFIX}manga <manga_title>`,
  async execute(message, args) {
    const { channel } = message;
    const search = args.join(" ");

    const sdk = getSdk(client);
    const result = await sdk.searchManga({ search, type: MediaType.Manga });

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
      genres,
      status,
      title,
      source,
      startDate,
      endDate,
      volumes,
      chapters,
    } = result.Media;

    channel.send(
      genMangaInfoEmbed({
        coverImage: coverImage?.medium,
        title: title?.userPreferred,
        description: description!,
        status,
        genres,
        averageScore,
        startDate,
        endDate,
        source,
        volumes,
        chapters,
      })
    );
  },
};

export default manga;
