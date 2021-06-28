import { CmdCategory } from '.prisma/client';
import axios from 'axios';
import {
  Collection,
  DiscordAPIError,
  TextChannel,
  User,
  Webhook,
} from 'discord.js';
import { prisma } from '../../data/prismaClient';
import { forKaguyaInput, forKaguyaResponse } from '../../data/redisClient';
import { kaguya_pfp_png } from '../../shared/assets';
import { sendInsufficientRibbons } from '../../shared/embeds';
import { Command } from '../../types/command';
import {
  cacheInput,
  cacheResponse,
  genChatData,
  handleHuggingFaceError,
  handleWebhookAPIError,
} from './utils/chatbot';

const kaguya = new Command({
  name: 'kaguya',
  aliases: ['ka'],
  args: [{ name: 'your_message', optional: false, multi: true }],
  category: CmdCategory.FUN,
  description: 'Chat with Kaguya, who has an IQ above 3.',

  async execute(message, args) {
    const { channel, author } = message;
    if (!(channel instanceof TextChannel)) return;

    let hooks: Collection<string, Webhook>;
    try {
      hooks = await channel.fetchWebhooks();
    } catch (err) {
      // no webhook permissions, most likely
      handleWebhookAPIError(channel, err);
      return;
    }

    // try and find Kaguya in the collection of webhooks
    let kaguya = hooks.find(
      (wh) =>
        wh.name === 'Kaguya' &&
        wh.owner instanceof User &&
        wh.owner.id === process.env.BOT_USER_ID,
    );

    if (!kaguya) {
      // try to create a webhook for Kaguya
      // TODO: add error handling if the channel has already maxed out
      kaguya = await channel
        .createWebhook('Kaguya', {
          avatar: kaguya_pfp_png,
        })
        .catch((err: DiscordAPIError) => {
          return handleWebhookAPIError(channel, err);
        });
    }
    // we couldn't create a webhook
    if (!kaguya) {
      return;
    }

    const text = args.join(' ');
    const ribbonCost = text.length;
    const ribbonStock = await prisma.getRibbons(author);
    if (ribbonCost > ribbonStock) {
      sendInsufficientRibbons(channel, ribbonCost, ribbonStock);
      return;
    }

    const data = await genChatData(channel.id, {
      input: forKaguyaInput,
      response: forKaguyaResponse,
      text,
    });

    axios
      .post(process.env.HUGGING_FACE_KAGUYA, data, {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_KAGUYA_KEY}`,
        },
      })
      .then((res) => {
        const reply = res.data.generated_text;
        kaguya!.send(`> ${text}\n${reply}`);

        cacheInput(channel.id, text, forKaguyaInput);
        cacheResponse(channel.id, reply, forKaguyaResponse);

        prisma.decrRibbons(author, ribbonCost);
      })
      .catch((err) => {
        handleHuggingFaceError(kaguya!, err, 'ka', text);
      });
  },
});

export default kaguya;
