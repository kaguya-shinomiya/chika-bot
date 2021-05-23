import { MessageEmbed } from "discord.js";
import { chika_crying_png, chika_pink } from "../constants";

export const genericErrorEmbed = new MessageEmbed()
  .setColor(chika_pink)
  .setThumbnail(chika_crying_png)
  .setDescription("I ran into an unknown error while running your request.");
