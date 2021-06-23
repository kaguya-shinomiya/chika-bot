import { lightErrorEmbed } from '../../../shared/embeds';
import { GenericChannel } from '../../../types/command';

export const sendNotFoundError = (s: string, channel: GenericChannel) =>
  channel.send(lightErrorEmbed(`I couldn't find any info for **${s}**.`));
