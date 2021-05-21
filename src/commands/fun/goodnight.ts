import { Command } from "../../types/command";
import { MessageEmbed } from "discord.js";

const goodnight: Command = {
  name: "goodnight",
  description: "Greets goodnight.",
  category: "Fun",
  usage: "goodnight [user ...]",
  aliases: ["gn"],
  execute({ channel, mentions, author }, _args) {
    let message;
    if (!mentions.users.size) {
      message = `Goodnight!`;
    } else {
      let userNames: string[] = [];
      mentions.users.forEach((user) => userNames.push(user.toString()));
      message =
        userNames.length > 1
          ? `${author.toString()} wishes` +
            userNames.slice(0, userNames.length - 1).join(",") +
            `and ${userNames[userNames.length - 1].toString()} goodnight!`
          : `${author.toString()} wishes ${userNames[0].toString()} goodnight!`;
    }
    const embed = new MessageEmbed()
      .setDescription(message)
      .setImage("https://i.imgur.com/4y1lORB.gif");
    channel.send(embed);
  },
};

export default goodnight;
