import { stripIndents } from 'common-tags';
import { DiscordAPIError, Webhook } from 'discord.js';
import { redis, redisPrefixer } from '../../../data/redisClient';
import { lightErrorEmbed } from '../../../shared/embeds';
import { GenericChannel } from '../../../types/command';
import {
  chatbotLimitError,
  chatbotLoadingError,
  chatbotTimeoutError,
} from './embeds';
import type { ChatbotChar, ChatbotInput } from './types';

interface IChatDataOptions {
  input: redisPrefixer;
  response: redisPrefixer;
  text: string;
}

export async function genChatData(
  channelId: string,
  options: IChatDataOptions,
): Promise<string> {
  const { input, response, text } = options;
  const generated_responses = (
    await redis.lrange(response(channelId), 0, -1)
  ).reverse();
  const past_user_inputs = (
    await redis.lrange(input(channelId), 0, -1)
  ).reverse();

  const data: ChatbotInput = {
    inputs: { text, generated_responses, past_user_inputs },
  };
  return JSON.stringify(data);
}

export function cacheInput(
  channelId: string,
  text: string,
  prefixFn: redisPrefixer,
) {
  const key = prefixFn(channelId);
  redis.pipeline().lpush(key, text).ltrim(key, 0, 2).expire(key, 120).exec();
}

export function cacheResponse(
  channelId: string,
  response: string,
  prefixFn: redisPrefixer,
) {
  const key = prefixFn(channelId);
  redis
    .pipeline()
    .lpush(key, response.replace(/[^\w\s]/gi, ''))
    .ltrim(key, 0, 2)
    .expire(key, 120)
    .exec();
}

export function handleHuggingFaceError(
  channelOrWebhook: GenericChannel | Webhook,
  err: any,
  char: ChatbotChar,
  text?: string,
) {
  console.error(err);
  if (err.response?.data?.error?.includes(`is currently loading`)) {
    if (channelOrWebhook instanceof Webhook) {
      channelOrWebhook.send(text && `> ${text}`, {
        embeds: [chatbotLoadingError(char)],
      });
    } else {
      channelOrWebhook.send(text && `> ${text}`, {
        embed: chatbotLoadingError(char),
      });
    }
  } else if (err.response?.data?.error?.includes(`API usage limit reached`)) {
    if (channelOrWebhook instanceof Webhook) {
      channelOrWebhook.send(text && `> ${text}`, {
        embeds: [chatbotLimitError(char)],
      });
    } else {
      channelOrWebhook.send(text && `> ${text}`, {
        embed: chatbotLimitError(char),
      });
    }
  } else {
    if (channelOrWebhook instanceof Webhook) {
      channelOrWebhook.send(text && `> ${text}`, {
        embeds: [chatbotTimeoutError(char)],
      });
    } else {
      channelOrWebhook.send(text && `> ${text}`, {
        embed: chatbotTimeoutError(char),
      });
    }
  }
}

export function handleWebhookAPIError(
  channel: GenericChannel,
  err: DiscordAPIError,
) {
  if (err.code === 50013) {
    // we don't have permissions to manage webhooks
    channel.send(
      lightErrorEmbed(
        stripIndents`
				I need permissions to manage webhooks in this channel!
				Otherwise I can't invite Kaguya here...`,
      ),
    );
    return undefined;
  }
  if (err.code === 30007) {
    // they maxed out the number of webhooks
    channel.send(
      lightErrorEmbed(stripIndents`
    This channel has already hit the maximum number of webhooks.
    I can't invite Kaguya to this channel...`),
    );
  }
  console.error(err);
  return undefined;
}
