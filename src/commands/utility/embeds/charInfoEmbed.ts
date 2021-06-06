import { unknown_png } from "../../../assets";
import { FuzzyDate } from "../../../generated/graphql";
import { baseEmbed } from "../../../shared/embeds";
import { parseHtml, truncate, wrapText } from "../../../utils/typography";
import { parseFuzzyDate } from "./mangaInfoEmbed";

interface charInfoEmbedParams {
  englishName: string | null | undefined;
  japName: string | null | undefined;
  image: string | null | undefined;
  age: string | null | undefined;
  gender: string | null | undefined;
  description: string | null | undefined;
  dateOfBirth: FuzzyDate | null | undefined;
  siteUrl: string | null | undefined;
}

export const charInfoEmbed = (info: charInfoEmbedParams) => {
  const {
    englishName,
    japName,
    image,
    gender,
    age,
    dateOfBirth,
    description,
    siteUrl,
  } = info;
  let genderEmoji;
  switch (gender?.toLowerCase()) {
    case "male":
      genderEmoji = ":male_sign:";
      break;
    case "female":
      genderEmoji = ":female_sign:";
      break;
    default:
      genderEmoji = "";
      break;
  }

  return baseEmbed()
    .setTitle(`${englishName || "?"} ${genderEmoji}\n${japName || "?"}`)
    .setDescription(characterDescription(description, siteUrl))
    .addFields([
      { name: ":calendar: Age", value: age || "?", inline: true },
      {
        name: ":cake: Birthday",
        value: parseFuzzyDate(dateOfBirth),
        inline: true,
      },
    ])
    .setImage(image || unknown_png);
};

function characterDescription(
  desc: string | null | undefined,
  siteUrl: string | null | undefined
) {
  if (!desc) return "*No description for this character.*";
  let body = truncate(parseHtml(desc), 70, true);
  if (!siteUrl || body.length === desc.length) return body;
  body = `${wrapText(`${body} [read more]`)}(${siteUrl})`;
  return body;
}
