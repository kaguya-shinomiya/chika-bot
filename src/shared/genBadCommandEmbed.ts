import { chika_crying_jpg, chika_pink } from "../constants";
import { MessageEmbed } from "discord.js";

export const genBadCommandEmbed = (...badCommands: string[]) => {
  return new MessageEmbed()
    .setColor(chika_pink)
    .setThumbnail(chika_crying_jpg)
    .setDescription(
      `I couldn't understand these commands: ${badCommands
        .map((cmd) => `**${cmd}**`)
        .join(", ")}.`
    )
    .addField(
      "\u200b",
      "Run `ck!help` to get a list of all the commands I know."
    );
};
