import { CmdCategory } from '@prisma/client';
import axios from 'axios';
import { prisma } from '../../data/prismaClient';
import { forChikaInput, forChikaResponse } from '../../data/redisClient';
import { sendInsufficientRibbons } from '../../shared/embeds';
import { Command } from '../../types/command';
import {
  cacheInput,
  cacheResponse,
  genChatData,
  handleHuggingFaceError,
} from './utils/chatbot';

const chika = new Command({
  name: 'chika',
  aliases: ['ck'],
  args: [{ name: 'your_message', multi: true }],
  category: CmdCategory.FUN,
  description:
    'Chat with Chika. Be careful though, her IQ drops below 3 at times. This costs ribbons.',

  async execute(message, args) {
    const { channel, author } = message;

    const text = args.join(' ');

    const ribbonCost = text.length;
    const ribbonStock = await prisma.getRibbons(author);
    if (ribbonCost > ribbonStock) {
      sendInsufficientRibbons(channel, ribbonCost, ribbonStock);
      return;
    }

    const data = await genChatData(channel.id, {
      input: forChikaInput,
      response: forChikaResponse,
      text,
    });

    axios
      .post(process.env.HUGGING_FACE_CHIKA, data, {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_CHIKA_KEY}`,
        },
      })
      .then((res) => {
        const reply = res.data.generated_text;
        channel.send(`> ${text}\n${reply}`);

        cacheInput(channel.id, text, forChikaInput);
        cacheResponse(channel.id, reply, forChikaResponse);

        prisma.decrRibbons(author, ribbonCost);
      })
      .catch((err) => {
        handleHuggingFaceError(channel, err, 'ck', text);
      });
  },
});

export default chika;
