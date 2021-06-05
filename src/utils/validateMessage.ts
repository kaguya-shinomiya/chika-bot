import type { Message, User } from "discord.js";
import type { GenericChannel } from "../types/command";

interface validateMessageOptions {
  channel: GenericChannel;
  author: User;
  content: RegExp;
}

export const validateMessage = (
  message: Message,
  options: validateMessageOptions
): boolean => {
  const { channel, author, content } = options;
  if (channel && message.channel.id !== channel.id) return false;
  if (author && message.author.id !== author.id) return false;
  if (content && !content.test(message.content)) return false;
  return true;
};
