import { PREFIX } from "../../constants";
import {
  sendNoGameSelectedError,
  sendUnknownGameError,
} from "../../games/utils/errorSenders";
import { Command } from "../../types/command";

// TODO ensure only one play per channel

export const game: Command = {
  name: "game",
  description: "Play a game with Pro Gamer Chika.",
  category: "Fun",
  usage: `${PREFIX}game <game_title>`,
  argsCount: -1,
  execute(message, args) {
    const [requestedGame] = args;
    if (!requestedGame) {
      sendNoGameSelectedError(message.channel);
      return;
    }
    const toPlay = message.client.games.find(
      (_game) => _game.title === requestedGame.toLowerCase()
    );
    if (!toPlay) {
      sendUnknownGameError(requestedGame, message.channel);
      return;
    }
    if (toPlay.pregame) {
      toPlay.pregame(message);
    }
  },
};

export default game;
