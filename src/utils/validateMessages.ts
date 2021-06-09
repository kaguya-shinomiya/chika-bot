import type { Message, User } from "discord.js";
import { Guild } from "discord.js";
import { sendNotAdmin, sendNotInGuild } from "../shared/embeds";
import type { GenericChannel } from "../types/command";

interface validateMessageOptions {
  channelId?: string;
  channel?: GenericChannel;
  channels?: GenericChannel[];
  guild?: Guild;
  guildId?: string;
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
    guild,
    guildId,
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

  if (guild && guild.id !== message.guild?.id) return null;
  if (guildId && message.guild?.id !== guildId) return null;

  return message;
};

export const isAdmin = (message: Message) => {
  const { member, channel } = message;
  if (!member) {
    sendNotInGuild(channel);
    return false;
  }
  if (!member.hasPermission("ADMINISTRATOR")) {
    sendNotAdmin(channel);
    return false;
  }
  return true;
};
