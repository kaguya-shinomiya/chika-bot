import { unknown_png } from "../../../assets";
import { FuzzyDate } from "../../../generated/graphql";
import { baseEmbed } from "../../../shared/embeds";
import { questionMark } from "./animeInfoEmbed";
import { parseFuzzyDate } from "./mangaInfoEmbed";

interface charInfoEmbedParams {
  englishName: string | null | undefined;
  japName: string | null | undefined;
  image: string | null | undefined;
  age: string | null | undefined;
  gender: string | null | undefined;
  description: string | null | undefined;
  dateOfBirth: FuzzyDate | null | undefined;
}

export const genCharInfoEmbed = (info: charInfoEmbedParams) => {
  const { englishName, japName, image, gender, age, dateOfBirth } = info;
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
    .setTitle(`${englishName || "?"} | ${japName || "?"} ${genderEmoji}`)
    .addFields([
      { name: ":calendar: Age", value: age || questionMark, inline: true },
      {
        name: ":cake: Birthday",
        value: parseFuzzyDate(dateOfBirth),
        inline: true,
      },
    ])
    .setImage(image || unknown_png);
};
