import { MessageEmbed, User } from "discord.js";
import { PREFIX } from "../../constants";
import { baseEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { RedisPrefix } from "../../types/redis";

const avatarEmbed = (user: User): MessageEmbed =>
  baseEmbed()
    .setImage(user.displayAvatarURL({ dynamic: true }))
    .setFooter(`${user.username}'s avatar`);

const avatar: Command = {
  name: "avatar",
  description: "Retrieves users' avatars.",
  category: "Fun",
  usage: `${PREFIX}avatar [user ...]`,
  argsCount: -1,
  redis: RedisPrefix.default,
  async execute({ mentions, author, channel }) {
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
