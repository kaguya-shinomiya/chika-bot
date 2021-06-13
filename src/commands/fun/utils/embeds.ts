import type { User, MessageEmbed } from "discord.js";
import { baseEmbed } from "../../../shared/embeds";

export const avatarEmbed = (user: User): MessageEmbed =>
  baseEmbed()
    .setImage(user.displayAvatarURL({ dynamic: true }))
    .setFooter(`${user.tag}'s avatar`);
