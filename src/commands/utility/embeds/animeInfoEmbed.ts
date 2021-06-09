import { unknown_png } from "../../../shared/assets";
import {
  Maybe,
  MediaSeason,
  MediaSource,
  MediaStatus,
} from "../../../generated/graphql";
import { baseEmbed } from "../../../shared/embeds";
import { capitalize, parseHtml } from "../../../utils/typography";

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

export const animeInfoEmbed = (info: animeEmbedParams) => {
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
        value: status
          ? capitalize(status.replace(/_/g, " ").toLowerCase(), {
              onlyFirst: true,
            })
          : "?",
        inline: true,
      },
      {
        name: ":cherry_blossom: Season",
        value:
          seasonYear && season
            ? `${capitalize(season.toLowerCase())} ${seasonYear}`
            : "?",
        inline: true,
      },
    ])
    .addField(":shinto_shrine: Genres", genres?.join(", ") || ":question:")
    .addFields([
      {
        name: ":tv: Episodes",
        value: `${episodes || "?"}`,
        inline: true,
      },
      {
        name: ":star: Rating",
        value: averageScore ? `${averageScore}/100` : "?",
        inline: true,
      },
      {
        name: ":ramen: Sauce",
        value: source
          ? capitalize(source.replace(/_/g, " ").toLowerCase())
          : "?",
        inline: true,
      },
    ]);
};
