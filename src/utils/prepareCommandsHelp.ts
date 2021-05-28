import { Collection, EmbedFieldData, MessageEmbed } from "discord.js";
import { detectiveEmbed } from "../shared/embeds";
import { Command, commandCategory } from "../types/command";

export const prepareCommandsHelp = (
  commands: Collection<string, Command>
): MessageEmbed => {
  const categoryMap: Record<commandCategory, Command[]> = {} as any;
  commands.forEach((command) => {
    if (categoryMap[command.category]) {
      categoryMap[command.category].push(command);
    } else {
      categoryMap[command.category] = [command];
    }
  });
  const fields: EmbedFieldData[] = [];
  Object.keys(categoryMap).forEach((category) => {
    const cmds = categoryMap[category as commandCategory].map(
      (command) => `\`${command.name}\``
    );
    fields.push({ name: category, value: cmds.join(", ") });
  });
  return detectiveEmbed().setTitle("Chika Commands").addFields(fields);
};
