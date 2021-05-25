import { Collection, EmbedFieldData, MessageEmbed } from "discord.js";
import { chika_detective_png } from "../assets";
import { chika_pink } from "../constants";
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
  return new MessageEmbed()
    .setColor(chika_pink)
    .setTitle("Chika Commands")
    .setThumbnail(chika_detective_png)
    .addFields(fields);
};
