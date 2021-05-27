import { MessageEmbed, User } from "discord.js";
import {
  chika_crying_png,
  chika_detective_png,
  chika_peeking_png,
  chika_pointing_png,
  chika_rap_png,
} from "../assets";
import { chika_pink, PREFIX } from "../constants";
import { Command } from "../types/command";

export const baseEmbed = () => new MessageEmbed().setColor(chika_pink);

export const cryingEmbed = () => baseEmbed().setThumbnail(chika_crying_png);
export const detectiveEmbed = () =>
  baseEmbed().setThumbnail(chika_detective_png);
export const peekingEmbed = () => baseEmbed().setThumbnail(chika_peeking_png);
export const pointingEmbed = () => baseEmbed().setThumbnail(chika_pointing_png);
export const rappingEmbed = () => baseEmbed().setThumbnail(chika_rap_png);

export const lightErrorEmbed = (msg: string) =>
  baseEmbed().setDescription(`:broken_heart: ${msg}`);
export const lightOkEmbed = (msg: string) =>
  baseEmbed().setDescription(`:magic_wand: ${msg}`);

export const badArgsEmbed = (command: Command, provided: number) =>
  // TODO display help message for the command
  cryingEmbed()
    .setDescription(
      `Command \`${command.name}\` expected ${
        command.argsCount === -2 ? "at least one " : command.argsCount
      } ${
        command.argsCount === 1 || command.argsCount === -2
          ? `argument`
          : `arguments`
      }, but ${provided} ${provided === 1 ? `was` : `were`} provided.`
    )
    .addField(
      "Further Help",
      `For more info, you may run \`${PREFIX}help ${command.name}\`.`
    );

export const badCommandsEmbed = (...badCommands: string[]) =>
  cryingEmbed()
    .setDescription(
      `I couldn't understand these commands: ${badCommands
        .map((cmd) => `**${cmd}**`)
        .join(", ")}.`
    )
    .addField(
      "Further Help",
      `To get a list of all the commands I know, run \`${PREFIX}help\`.`
    );

export const genericErrorEmbed = () =>
  cryingEmbed()
    .setTitle("Oh no!")
    .setDescription("I ran into an unknown error while running your request.");

export const withAuthorEmbed = (author: User) =>
  baseEmbed().setFooter(
    `Requested by ${author.username}`,
    author.displayAvatarURL({ size: 32, dynamic: false })
  );
