import type { Message } from "discord.js";
import { RedisPrefixed } from "../../../types/redis";
import { filterMessage } from "../../../utils/filterMessage";
import { postGameBalloon } from "./postGame";
import type { BalloonState } from "./types";

export const createBalloonListener = (
  state: BalloonState,
  redis: RedisPrefixed
) => {
  const { players, channelId } = state;
  const { ribbonsRedis } = redis;
  const listener = (message: Message) => {
    const { content, author, client, channel } = message;
    if (
      !filterMessage(message, {
        authors: players.map((user) => user),
        channelId,
      })
    ) {
      client.once("message", listener);
      return;
    }

    // eslint-disable-next-line no-param-reassign
    state.currentVolume += content.length;
    if (state.currentVolume > state.tolerance) {
      postGameBalloon(channel, author, players, ribbonsRedis);
      return;
    }

    client.once("message", listener);
  };
  return listener;
};
