import { unknown_png } from "../../../assets";
import {
  FuzzyDate,
  Maybe,
  MediaSource,
  MediaStatus,
} from "../../../generated/graphql";
import { baseEmbed } from "../../../shared/embeds";
import { capitalize, parseHtml } from "../../../utils/text";
import { questionMark } from "./animeInfoEmbed";

interface mangaEmbedParams {
  title: string | null | undefined;
  description: string | null | undefined;
  status: MediaStatus | null | undefined;
  averageScore: number | null | undefined;
  coverImage: string | null | undefined;
  genres: Maybe<String>[] | null | undefined;
  source: MediaSource | null | undefined;
  startDate: FuzzyDate | null | undefined;
  endDate: FuzzyDate | null | undefined;
  volumes: number | null | undefined;
  chapters: number | null | undefined;
}

export function parseFuzzyDate(date?: FuzzyDate | null): string {
  if (!date) {
    return questionMark;
  }
  const { year, month, day } = date;
  console.log(JSON.stringify(date));
  if (!year && !month && !day) {
    return questionMark;
  }
  return `${day || "?"}-${month || "?"}-${year || "?"}`;
}

export const genMangaInfoEmbed = (info: mangaEmbedParams) => {
  const {
    coverImage,
    title,
    description,
    status,
    genres,
    source,
    averageScore,
    startDate,
    endDate,
    chapters,
    volumes,
  } = info;
  return baseEmbed()
    .setThumbnail(coverImage || unknown_png)
    .setTitle(title)
    .setDescription(
      description ? parseHtml(description) : `*No description for this manga.*`
    )
    .addFields([
      {
        name: ":pencil: Status",
        value: status ? capitalize(status.toLowerCase()) : questionMark,
        inline: true,
      },
      {
        name: ":calendar: Published",
        value: `From **${parseFuzzyDate(startDate)}** to **${parseFuzzyDate(
          endDate
        )}**`,
        inline: true,
      },
      {
        name: ":ramen: Sauce",
        value: source
          ? capitalize(source.replace(/_/g, " ").toLowerCase())
          : questionMark,
        inline: true,
      },
    ])
    .addField(":shinto_shrine: Genres", genres?.join(", ") || ":question:")
    .addFields([
      { name: ":books: Volumes", value: volumes || questionMark, inline: true },
      {
        name: ":newspaper2: Chapters",
        value: chapters || questionMark,
        inline: true,
      },
      {
        name: ":star: Rating",
        value: averageScore ? `${averageScore}/100` : questionMark,
        inline: true,
      },
    ]);
};
