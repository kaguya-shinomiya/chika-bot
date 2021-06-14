import { CmdCategory } from "@prisma/client";
import type { Collection, EmbedFieldData, MessageEmbed } from "discord.js";
import { DEFAULT_PREFIX } from "../shared/constants";
import { detectiveEmbed } from "../shared/embeds";
import type { Command } from "../types/command";

export const genFullHelpEmbed = (
  commands: Collection<string, Command>
): MessageEmbed => {
  const categoryMap: Record<CmdCategory, Command[]> = {} as any;
  commands.forEach((command) => {
    if (categoryMap[command.category]) {
      categoryMap[command.category].push(command);
    } else {
      categoryMap[command.category] = [command];
    }
  });
  const fields: EmbedFieldData[] = [];
  Object.keys(categoryMap).forEach((category) => {
    const cmds = categoryMap[category as CmdCategory].map(
      (command) => `\`${command.name}\``
    );
    fields.push({
      name: tagEmoji(category as CmdCategory),
      value: cmds.join(", "),
    });
  });
  return detectiveEmbed()
    .setTitle("Chika Commands")
    .addFields(fields)
    .setFooter(
      `For more info about a specific command, run ${DEFAULT_PREFIX}help <command>.`
    );
};

function tagEmoji(category: CmdCategory) {
  switch (category) {
    case "CURRENCY":
      return ":moneybag: Currency";
    case "FUN":
      return ":coffee: Fun";
    case "GAMES":
      return ":video_game: Game";
    case "MUSIC":
      return ":headphones: Music";
    case "UTILITY":
      return ":satellite: Utility";
    default:
      return ":coffee: Fun";
  }
}
