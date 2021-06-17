import _ from "lodash";
import {
  FuzzyDate,
  Maybe,
  MediaSource,
  MediaStatus,
} from "../../../generated/anilist";
import { unknown_png } from "../../../shared/assets";
import { baseEmbed } from "../../../shared/embeds";
import { parseHtml } from "../../../utils/typography";

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
    return "?";
  }
  const { year, month, day } = date;
  if (!year && !month && !day) {
    return "?";
  }
  return `${day || "?"}-${month || "?"}-${year || "?"}`;
}

export const mangaInfoEmbed = (info: mangaEmbedParams) => {
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
        value: status
          ? _.startCase(status.replace(/_/g, " ").toLowerCase())
          : "?",
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
          ? _.startCase(source.replace(/_/g, " ").toLowerCase())
          : "?",
        inline: true,
      },
    ])
    .addField(":shinto_shrine: Genres", genres?.join(", ") || ":question:")
    .addFields([
      { name: ":books: Volumes", value: volumes || "?", inline: true },
      {
        name: ":newspaper2: Chapters",
        value: chapters || "?",
        inline: true,
      },
      {
        name: ":star: Rating",
        value: averageScore ? `${averageScore}/100` : "?",
        inline: true,
      },
    ]);
};
