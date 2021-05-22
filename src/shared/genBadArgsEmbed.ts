import { MessageEmbed } from "discord.js";
import { chika_crying_jpg, chika_pink } from "../constants";
import { Command } from "../types/command";

export const genBadArgsEmbed = (command: Command, provided: number) => {
  // TODO display help message for the command
  return new MessageEmbed()
    .setColor(chika_pink)
    .setThumbnail(chika_crying_jpg)
    .setDescription(
      `Command \`${command.name}\` expected ${command.argsCount} ${
        command.argsCount === 1 ? `argument` : `arguments`
      }, but ${provided} ${provided === 1 ? `was` : `were`} provided.`
    )
    .addField("\u200b", `Run \`ck!help ${command.name}\` for more info.`);
};