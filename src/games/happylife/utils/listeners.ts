import { Client, Message } from "discord.js";
import { Redis } from "ioredis";
import { validateMessage } from "../../../shared/validateMessage";
import { pingRedis } from "../../utils/listeners";
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

    // TODO roll from 1 - 6
    // change player state to the right tile
    // remove that tile from play
    // execute tile's onLand

    const steps = Math.floor(Math.random() * 6 + 1);
    message.channel.send(`you moved ${steps}`);

    // shift position
    const currentStats = stats.get(nextPlayer.id)!;
    const currentIndex = cards.findIndex(
      (card) => card.id === currentStats?.cursor
    );

    const [cardLanded] = cards.splice(currentIndex + steps);
    message.channel.send(
      `you landed on ${cardLanded.name} - ${cardLanded.description}`
    );
    cardLanded.onLand(state, message, redis);
  };

  client.once("message", rollListener);
};
