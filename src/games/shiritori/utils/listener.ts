import type { Message } from "discord.js";
import type { Redis } from "ioredis";
import { chika_beating_yu_gif, white_check_mark } from "../../../assets";
import { baseEmbed } from "../../../shared/embeds";
import { filterMessage } from "../../../utils/filterMessage";
import { checkWord } from "./checkWord";
import { shiritoriPlayerCardsEmbed } from "./embeds";
import type { ShiritoriState } from "./types";

export const createOnceShiritoriListener = (
  state: ShiritoriState,
  redis: Redis
) => {
  const shiritoriListener = async (message: Message) => {
    const { author, content, channel, client } = message;
    if (!(await redis.get(channel.id))) return;

    const onRejectListener = createOnceShiritoriListener(state, redis);
    const reject = () => client.once("message", onRejectListener);

    if (
      !filterMessage(message, {
        channelId: state.channelId,
        authors: [state.p1, state.p2],
        content: new RegExp(`/^${state.startingChar}/i`),
        minLen: 4, // TODO make this a per server setting
      })
    ) {
      reject();
      return;
    }

    const playerCards = state.cards.get(author.id)!;

    const lastChar = content[content.length - 1];
    if (!playerCards.includes(content[content.length - 1])) {
      reject();
      return;
    }

    const isValidWord = await checkWord(content);
    if (!isValidWord) {
      reject();
      return;
    }

    channel.send(`I accept **${content}**! ${white_check_mark}`);
    playerCards.splice(playerCards.indexOf(lastChar), 1); // it's valid, pop that word out

    if (playerCards.length === 0) {
      channel.send(
        baseEmbed()
          .setDescription(
            `**${author.username}** defeats **${
              author.id === state.p1.id ? state.p2.username : state.p1.username
            }!**`
          )
          .setImage(chika_beating_yu_gif)
      );
      stopGame();
      return;
    }

    client.once("message", createOnceShiritoriListener(state, redis));
    channel
      .send(shiritoriPlayerCardsEmbed(state))
      .then(() => channel.send(`:regional_indicator_${lastChar}:`));

    // eslint-disable-next-line no-param-reassign
    state.startingChar = lastChar;

    function stopGame() {
      redis.del(channel.id);
    }
  };

  return shiritoriListener;
};
