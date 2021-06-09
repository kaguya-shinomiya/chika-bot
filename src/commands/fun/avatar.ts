import { MessageEmbed, User } from "discord.js";
import { DEFAULT_PREFIX } from "../../shared/constants";
import { baseEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";

const avatarEmbed = (user: User): MessageEmbed =>
  baseEmbed()
    .setImage(user.displayAvatarURL({ dynamic: true }))
    .setFooter(`${user.username}'s avatar`);

const avatar: Command = {
  name: "avatar",
  description: "Retrieves users' avatars.",
  category: "Fun",
  usage: `${DEFAULT_PREFIX}avatar [user ...]`,
  argsCount: -1,
  async execute(message) {
    const { mentions, author, channel } = message;
    if (!mentions.users.size) {
      channel.send(avatarEmbed(author));
      return;
    }
    mentions.users.forEach((user) => {
      channel.send(avatarEmbed(user));
    });
  },
};

export default avatar;
