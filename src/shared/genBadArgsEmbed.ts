import { MessageEmbed } from "discord.js";
import { chika_pink, PREFIX } from "../constants";
import { chika_crying_png } from "../assets";
import { Command } from "../types/command";

export const genBadArgsEmbed = (command: Command, provided: number) => {
  // TODO display help message for the command
  return new MessageEmbed()
    .setColor(chika_pink)
    .setThumbnail(chika_crying_png)
    .setDescription(
      `Command \`${command.name}\` expected ${command.argsCount} ${
        command.argsCount === 1 ? `argument` : `arguments`
      }, but ${provided} ${provided === 1 ? `was` : `were`} provided.`
    )
    .addField("\u200b", `Run \`${PREFIX}help ${command.name}\` for more info.`);
};
