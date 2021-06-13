import type { Message } from "discord.js";
import { filterMessage } from "../../../utils/validateMessages";
import { unblock } from "../../utils/manageState";
import type { Balloon } from "../balloon";
import { postGameBalloon } from "./postGame";
import type { BalloonState } from "./types";

export const createBalloonListener = (state: BalloonState, game: Balloon) => {
  const { players, channelId } = state;
  const listener = (message: Message) => {
    const { content, client } = message;
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
      unblock(game, message);
      postGameBalloon(message, players);
      return;
    }

    client.once("message", listener);
  };
  return listener;
};
