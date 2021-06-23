import type { User } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { GenericChannel } from '../types/command';
import {
  chika_crying_png,
  chika_detective_png,
  chika_peeking_png,
  chika_pink,
  chika_pointing_png,
  chika_rap_png,
  ribbon_emoji,
} from './assets';
import { DEFAULT_PREFIX } from './constants';

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

export const badCommandsEmbed = (...badCommands: string[]) =>
  cryingEmbed()
    .setDescription(
      `I couldn't understand these commands: ${badCommands
        .map((cmd) => `**${cmd}**`)
        .join(', ')}.`,
    )
    .addField(
      'Further help',
      `To get a list of all the commands I know, run \`${DEFAULT_PREFIX}help\`.`,
    );

export const genericErrorEmbed = () =>
  cryingEmbed()
    .setTitle('Oh no!')
    .setDescription('I ran into an unknown error while running your request.');

export const withAuthorEmbed = (author: User) =>
  baseEmbed().setFooter(
    `Requested by ${author.tag}`,
    author.displayAvatarURL({ size: 32, dynamic: false }),
  );

export const sendNotInGuild = async (channel: GenericChannel) =>
  channel.send(lightErrorEmbed('This command can only be used in a server!'));

export const sendInsufficientRibbons = (
  channel: GenericChannel,
  cost: number,
  stock: number,
) =>
  channel.send(
    lightErrorEmbed(
      `You don't have enough ribbons! You need ${cost} ${ribbon_emoji}, but only have ${stock} ${ribbon_emoji}.`,
    ),
  );

export const sendNotAdmin = (channel: GenericChannel) =>
  channel.send(lightErrorEmbed(`Only admins can  use that command!`));
