import type { Collection, EmbedFieldData, MessageEmbed } from "discord.js";
import { DEFAULT_PREFIX } from "../shared/constants";
import { detectiveEmbed } from "../shared/embeds";
import { Command, CommandCategory } from "../types/command";

export const fullHelpEmbed = (
  commands: Collection<string, Command>
): MessageEmbed => {
  const categoryMap: Record<CommandCategory, Command[]> = {} as any;
  commands.forEach((command) => {
    if (categoryMap[command.category]) {
      categoryMap[command.category].push(command);
    } else {
      categoryMap[command.category] = [command];
    }
  });
  const fields: EmbedFieldData[] = [];
  Object.keys(categoryMap).forEach((category) => {
    const cmds = categoryMap[category as CommandCategory].map(
      (command) => `\`${command.name}\``
    );
    fields.push({ name: category, value: cmds.join(", ") });
  });
  return detectiveEmbed()
    .setTitle("Chika Commands")
    .addFields(fields)
    .setFooter(
      `For more info about a specific command, run ${DEFAULT_PREFIX}help <command>.`
    );
};
