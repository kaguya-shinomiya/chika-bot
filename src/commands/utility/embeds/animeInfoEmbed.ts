import { unknown_png } from "../../../assets";
import {
  Maybe,
  MediaSeason,
  MediaSource,
  MediaStatus,
} from "../../../generated/graphql";
import { baseEmbed } from "../../../shared/embeds";
import { capitalize, parseHtml } from "../../../utils/text";

export const questionMark = ":grey_question:";

interface animeEmbedParams {
  title: string | null | undefined;
  description: string | null | undefined;
  status: MediaStatus | null | undefined;
  averageScore: number | null | undefined;
  episodes: number | null | undefined;
  coverImage: string | null | undefined;
  genres: Maybe<String>[] | null | undefined;
  season: MediaSeason | null | undefined;
  seasonYear: number | null | undefined;
  source: MediaSource | null | undefined;
}

export const genAnimeInfoEmbed = (info: animeEmbedParams) => {
  const {
    coverImage,
    title,
    description,
    episodes,
    status,
    genres,
    source,
    averageScore,
    season,
    seasonYear,
  } = info;
  return baseEmbed()
    .setThumbnail(coverImage || unknown_png)
    .setTitle(title)
    .setDescription(
      description ? parseHtml(description) : `*No description for this anime.*`
    )
    .addFields([
      {
        name: ":film_frames: Status",
        value: status ? capitalize(status.toLowerCase()) : questionMark,
        inline: true,
      },
      {
        name: ":cherry_blossom: Season",
        value:
          seasonYear && season
            ? `${capitalize(season.toLowerCase())} ${seasonYear}`
            : questionMark,
        inline: true,
      },
    ])
    .addField(":shinto_shrine: Genres", genres?.join(", ") || ":question:")
    .addFields([
      {
        name: ":tv: Episodes",
        value: `${episodes || questionMark}`,
        inline: true,
      },
      {
        name: ":star: Rating",
        value: averageScore ? `${averageScore}/100` : questionMark,
        inline: true,
      },
      {
        name: ":ramen: Sauce",
        value: source
          ? capitalize(source.replace(/_/g, " ").toLowerCase())
          : questionMark,
        inline: true,
      },
    ]);
};
