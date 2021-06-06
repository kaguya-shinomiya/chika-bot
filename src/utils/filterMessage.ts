import type { Message, User } from "discord.js";
import type { GenericChannel } from "../types/command";

interface validateMessageOptions {
  channelId?: string;
  channel?: GenericChannel;
  channels?: GenericChannel[];
  author?: User;
  authors?: User[];
  content?: RegExp;
  minLen?: number;
  maxLen?: number;
}

export const filterMessage = (
  message: Message,
  options: validateMessageOptions
): Message | null => {
  const {
    channel,
    channels,
    channelId,
    author,
    authors,
    content,
    minLen,
    maxLen,
  } = options;

  if (author && author.id !== message.author.id) return null;
  if (
    authors &&
    !authors.map((_author) => _author.id).includes(message.author.id)
  )
    return null;

  if (content && !content.test(message.content)) return null;
  if (minLen && message.content.length < minLen) return null;
  if (maxLen && message.content.length > maxLen) return null;

  if (channel && channel.id !== message.channel.id) return null;
  if (
    channels &&
    !channels.map((_channel) => _channel.id).includes(message.channel.id)
  )
    return null;
  if (channelId && message.channel.id !== channelId) return null;

  return message;
};
