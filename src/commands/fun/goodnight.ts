import { MessageEmbed } from "discord.js";
import { Command } from "../../types/command";
import { chika_pink, PREFIX } from "../../constants";
import { kaguya_sleep_gif } from "../../assets";

const goodnight: Command = {
  name: "goodnight",
  description: "Greets goodnight.",
  category: "Fun",
  usage: `${PREFIX}goodnight [user ...]`,
  aliases: ["gn"],
  argsCount: -1,
  execute({ channel, mentions, author }) {
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
    const embed = new MessageEmbed()
      .setColor(chika_pink)
      .setDescription(message)
      .setImage(kaguya_sleep_gif);
    channel.send(embed);
  },
};

export default goodnight;
