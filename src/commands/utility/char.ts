import { getSdk } from "../../generated/graphql";
import { Command, CommandCategory, PartialCommand } from "../../types/command";
import { genUsage } from "../../utils/genUsage";
import { charInfoEmbed } from "./embeds/charInfoEmbed";
import { sendNotFoundError } from "./embeds/errors";
import { client } from "./graphql/aniListClient";

export const char: PartialCommand = {
  name: "char",
  aliases: ["character"],
  args: [{ name: "character", multi: true }],
  category: CommandCategory.UTILITY,
  description: "Search for an animanga character.",

  async execute(message, args) {
    const { channel } = message;
    const charName = args.join(" ");

    const sdk = getSdk(client);
    sdk
      .searchChar({ charName })
      .then((result) => {
        if (!result.Character) {
          sendNotFoundError(charName, channel);
          return;
        }
        const { name, image, age, gender, description, dateOfBirth, siteUrl } =
          result.Character;

        channel.send(
          charInfoEmbed({
            englishName: name?.full,
            japName: name?.native,
            image: image?.large,
            gender,
            description,
            age,
            dateOfBirth,
            siteUrl,
          })
        );
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
        sendNotFoundError(charName, channel);
      });
  },
};

genUsage(char);
export default char as Command;
