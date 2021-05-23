import { Command, commandCategory } from "../types/command";
import { Collection, EmbedFieldData, MessageEmbed } from "discord.js";
import { chika_pink } from "../constants";
import { chika_detective_png } from "../assets";

export const prepareCommandsHelp = (
  commands: Collection<string, Command>
): MessageEmbed => {
  let categoryMap: Record<commandCategory, Command[]> = {} as any;
  commands.forEach((command) => {
    if (categoryMap[command.category]) {
      categoryMap[command.category].push(command);
    } else {
      categoryMap[command.category] = [command];
    }
  });
  let fields: EmbedFieldData[] = [];
  Object.keys(categoryMap).forEach((category) => {
    const commands = categoryMap[category as commandCategory].map(
      (command) => `\`${command.name}\``
    );
    fields.push({ name: category, value: commands.join(", ") });
  });
  return new MessageEmbed()
    .setColor(chika_pink)
    .setTitle("Chika Commands")
    .setThumbnail(chika_detective_png)
    .addFields(fields);
};
