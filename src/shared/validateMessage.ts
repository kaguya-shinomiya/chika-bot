import { Message } from "discord.js";

export interface validateMessageOptions {
  channelID?: string;
  userID?: string;
  content?: string;
}

export const validateMessage = (
  message: Message,
  options: validateMessageOptions
) => {
  if (message.author.bot) return false;
  if (
    options.content &&
    message.content.toLowerCase().trim() !== options.content
  )
    return false;
  if (options.channelID && message.channel.id !== options.channelID)
    return false;
  if (options.userID && message.author.id !== options.userID) return false;
  return true;
};
