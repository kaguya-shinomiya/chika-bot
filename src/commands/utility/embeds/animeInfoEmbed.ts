import { unknown_png } from "../../../assets";
import {
  FuzzyDate,
  Maybe,
  MediaSeason,
  MediaStatus,
} from "../../../generated/graphql";
import { baseEmbed } from "../../../shared/embeds";
import { capitalize } from "../../../utils/text";

const questionMark = ":question:";

interface animeEmbedParams {
  title: string | null | undefined;
  description: string | null | undefined;
  status: MediaStatus | null | undefined;
  averageScore: number | null | undefined;
  episodes: number | null | undefined;
  duration: number | null | undefined;
  coverImage: string | null | undefined;
  genres: Maybe<String>[] | null | undefined;
  season: MediaSeason | null | undefined;
  seasonYear: number | null | undefined;
}

export function parseFuzzyDate(date?: FuzzyDate | null): string {
  if (!date || !date.day || !date.month || !date.year) {
    return "?";
  }
  const { year, month, day } = date;
  return `${day}-${month}-${year}`;
}

export const genAnimeInfoEmbed = (info: animeEmbedParams) => {
  const {
    coverImage,
    title,
    description,
    episodes,
    status,
    genres,
    duration,
    averageScore,
    season,
    seasonYear,
  } = info;
  return baseEmbed()
    .setThumbnail(coverImage || unknown_png)
    .setTitle(title)
    .setDescription(
      description?.replace(/<\/?br>|<\/?i>/gi, "") ||
        `No description for this anime.`
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
        name: ":watch: Duration",
        value: duration ? `${duration} min` : questionMark,
        inline: true,
      },
      {
        name: ":star: Rating",
        value: averageScore ? `${averageScore}/100` : questionMark,
        inline: true,
      },
    ]);
};
