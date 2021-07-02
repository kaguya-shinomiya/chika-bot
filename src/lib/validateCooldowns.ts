import type { Message } from 'discord.js';
import ms from 'ms';
import { lightErrorEmbed } from '../shared/embeds';
import type { Command } from '../types/command';
import { getCooldown } from './cooldownManager';

export const isOnCooldown = async (
  message: Message,
  command: Command,
): Promise<boolean> => {
  const { channel, author } = message;
  if (command.channelCooldown) {
    const pttl = await getCooldown(channel.id, command.name);
    if (pttl) {
      channel.send(
        lightErrorEmbed(
          `Please wait ${ms(pttl)} before using **${
            command.name
          }** in this channel again.`,
        ),
      );
      return true;
    }
  }
  if (command.userCooldown) {
    const pttl = await getCooldown(author.id, command.name);
    if (pttl) {
      message.channel.send(
        lightErrorEmbed(
          `**${author.username}**, please wait ${ms(pttl)} before using **${
            command.name
          }** again.`,
        ),
      );
      return true;
    }
  }
  return false;
};
