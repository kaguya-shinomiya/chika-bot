import { PREFIX } from "../../types/constants";
import { getSdk } from "../../generated/graphql";
import { Command } from "../../types/command";
import { charInfoEmbed } from "./embeds/charInfoEmbed";
import { sendNotFoundError } from "./embeds/errors";
import { client } from "./graphql/aniListClient";

export const char: Command = {
  name: "char",
  aliases: ["character"],
  argsCount: -2,
  category: "Utility",
  usage: `${PREFIX}char <character_name>`,
  description: "Search for an animanga character.",
  execute(message, args) {
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
        console.log(err);
        sendNotFoundError(charName, channel);
      });
  },
};

export default char;
