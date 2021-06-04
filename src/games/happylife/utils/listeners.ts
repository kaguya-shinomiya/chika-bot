import { Client, Message } from "discord.js";
import { Redis } from "ioredis";
import { validateMessage } from "../../../shared/validateMessage";
import { pingRedis } from "../../utils/helpers";
import type { HappyLifeGameState } from "../gameState";

export const registerRollListener = (
  state: HappyLifeGameState,
  client: Client,
  redis: Redis
) => {
  const { channelID, playOrder, toPlay, cards, stats } = state;
  const rollListener = async (message: Message) => {
    if (!(await pingRedis(redis, channelID))) return;

    const nextPlayer = playOrder[toPlay];

    if (
      !validateMessage(message, {
        channelID,
        userID: nextPlayer.id,
        content: "!roll",
      })
    ) {
      client.once("message", rollListener);
      return;
    }

    const steps = Math.floor(Math.random() * 0 + 1);
    message.channel.send(`you moved ${steps}`);

    const currentStats = stats.get(nextPlayer.id)!;
    const currentIndex =
      cards.findIndex((card) => card.id > currentStats.cursor) - 1;

    const [cardLanded] = cards.splice(currentIndex + steps, 1);
    message.channel.send(
      `you landed on ${cardLanded.name} - ${cardLanded.description}`
    );

    currentStats.cursor = cardLanded.id;

    cardLanded.onLand(state, message, redis);
  };

  client.once("message", rollListener);
};
