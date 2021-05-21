import { MessageEmbed } from "discord.js";
import { chika_crying_jpg, chika_pink } from "../constants";

export const genericErrorEmbed = new MessageEmbed()
  .setColor(chika_pink)
  .setThumbnail(chika_crying_jpg)
  .setDescription("I ran into an unknown error while running your request.");
