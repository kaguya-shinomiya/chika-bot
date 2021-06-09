import { kaguya_sleep_gif } from "../../shared/assets";
import { DEFAULT_PREFIX } from "../../shared/constants";
import { baseEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";

const goodnight: Command = {
  name: "goodnight",
  description: "Greets goodnight.",
  category: "Fun",
  usage: `${DEFAULT_PREFIX}goodnight [user ...]`,
  aliases: ["gn"],
  argsCount: -1,
  async execute({ channel, mentions, author }) {
    let message;
    if (!mentions.users.size) {
      message = `Goodnight!`;
    } else {
      const userNames: string[] = [];
      mentions.users.forEach((user) => userNames.push(user.toString()));
      message =
        userNames.length > 1
          ? `**${author.username}** wishes ${userNames
              .slice(0, userNames.length - 1)
              .join(", ")} and ${userNames[
              userNames.length - 1
            ].toString()} goodnight!`
          : `${author.toString()} wishes ${userNames[0].toString()} goodnight!`;
    }
    channel.send(
      baseEmbed().setDescription(message).setImage(kaguya_sleep_gif)
    );
  },
};

export default goodnight;
