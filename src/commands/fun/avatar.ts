import { User } from "discord.js";
import { MessageEmbed } from "discord.js";
import { chika_pink, PREFIX } from "../../constants";
import { Command } from "../../types/command";

const genAvatarEmbed = (user: User): MessageEmbed =>
  new MessageEmbed()
    .setColor(chika_pink)
    .setImage(user.displayAvatarURL({ dynamic: true }))
    .setFooter(`${user.username}'s avatar`);

// TODO change to using embeds
const avatar: Command = {
  name: "avatar",
  description: "Retrieves users' avatars.",
  category: "Fun",
  usage: `${PREFIX}avatar [user ...]`,
  argsCount: -1,
  execute({ mentions, author, channel }, _args) {
    if (!mentions.users.size) {
      channel.send(genAvatarEmbed(author));
      return;
    }
    mentions.users.forEach((user) => {
      channel.send(genAvatarEmbed(user));
    });
  },
};

export default avatar;
