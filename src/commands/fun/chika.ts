import { CmdCategory } from '@prisma/client';
import axios from 'axios';
import { prisma } from '../../data/prismaClient';
import { forChikaInput, forChikaResponse, redis } from '../../data/redisClient';
import { baseEmbed, sendInsufficientRibbons } from '../../shared/embeds';
import { Command } from '../../types/command';
import { ChatbotInput } from './utils/types';

const chika = new Command({
  name: 'chika',
  aliases: ['ck'],
  args: [{ name: 'your_message', multi: true }],
  category: CmdCategory.FUN,
  description:
    "Chat with Chika. Be careful though, her IQ drops below 3 at times. You'll also need to pay in ribbons to chat with her, for some reason.",

  async execute(message, args) {
    const { channel, author } = message;

    const generated_responses = (
      await redis.lrange(forChikaResponse(channel.id), 0, -1)
    ).reverse();
    const past_user_inputs = (
      await redis.lrange(forChikaInput(channel.id), 0, -1)
    ).reverse();
    const text = args.join(' ');

    const ribbonCost = text.length;
    const ribbonStock = await prisma.getRibbons(author);
    if (ribbonCost > ribbonStock) {
      sendInsufficientRibbons(channel, ribbonCost, ribbonStock);
      return;
    }

    const input: ChatbotInput = {
      inputs: { text, generated_responses, past_user_inputs },
    };
    const data = JSON.stringify(input);

    axios
      .post(process.env.HUGGING_FACE_API_URL, data, {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        },
      })
      .then((res) => {
        const reply = res.data.generated_text;
        channel.send(`> ${text}\n${reply}`);
        redis
          .pipeline()
          .lpush(forChikaInput(channel.id), text)
          .ltrim(forChikaInput(channel.id), 0, 2)
          .expire(forChikaInput(channel.id), 60)
          .exec();

        redis
          .pipeline()
          .lpush(forChikaResponse(channel.id), reply.replace(/[^\w\s]/gi, ''))
          .ltrim(forChikaResponse(channel.id), 0, 2)
          .expire(forChikaResponse(channel.id), 60)
          .exec();

        prisma.decrRibbons(author, ribbonCost);
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.data?.error?.includes(`is currently loading`)) {
          channel.send(
            baseEmbed()
              .setDescription(
                `Thanks chatting with me! Please give me a minute to get ready.`,
              )
              .setFooter('(The API takes a moment to load sometimes lol)'),
          );
        }
      });
  },
});

export default chika;
