import { Command } from "../../types/command";
import { MessageEmbed } from "discord.js";
import { chika_pink, kaguya_sleep_gif } from "../../constants";

const goodnight: Command = {
  name: "goodnight",
  description: "Greets goodnight.",
  category: "Fun",
  usage: "ck!goodnight [user ...]",
  aliases: ["gn"],
  argsCount: -1,
  execute({ channel, mentions, author }, _args) {
    let message;
    if (!mentions.users.size) {
      message = `Goodnight!`;
    } else {
      let userNames: string[] = [];
      mentions.users.forEach((user) => userNames.push(user.toString()));
      message =
        userNames.length > 1
          ? `${author.toString()} wishes ` +
            userNames.slice(0, userNames.length - 1).join(", ") +
            ` and ${userNames[userNames.length - 1].toString()} goodnight!`
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
