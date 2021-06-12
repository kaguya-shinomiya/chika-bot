import { kaguya_sleep_gif } from "../../shared/assets";
import { baseEmbed } from "../../shared/embeds";
import { CommandCategory, PartialCommand } from "../../types/command";

const goodnight: PartialCommand = {
  name: "goodnight",
  description: "Greets goodnight.",
  category: CommandCategory.fun,
  aliases: ["gn"],
  args: [{ name: "user", optional: true }],

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
