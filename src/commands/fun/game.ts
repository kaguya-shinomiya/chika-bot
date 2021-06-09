import { PREFIX } from "../../constants";
import {
  sendInGame,
  sendNoGameSelectedError,
  sendUnknownGameError,
} from "../../games/utils/embeds";
import { validateMentions } from "../../games/utils/validateMentions";
import { Command } from "../../types/command";

export const game: Command = {
  name: "game",
  description: "Play a game with Pro Gamer Chika.",
  category: "Fun",
  usage: `${PREFIX}game <game_title>`,
  argsCount: -1,
  async execute(message, args, redis) {
    const { gamesRedis } = redis;
    const { channel, client } = message;

    const [requestedGame] = args;
    if (!requestedGame) {
      sendNoGameSelectedError(message.channel);
      return;
    }
    const toPlay = client.games.find(
      (_game) => _game.title === requestedGame.toLowerCase()
    );
    if (!toPlay) {
      sendUnknownGameError(requestedGame, message.channel);
      return;
    }

    if (await gamesRedis.get(channel.id)) {
      sendInGame(channel);
      return;
    }

    if (
      !validateMentions(message, {
        gameTitle: toPlay.displayTitle,
        isTwoPlayer: toPlay.minPlayerCount === 2 && toPlay.maxPlayerCount === 2,
      })
    )
      return;

    gamesRedis.set(channel.id, "true", "px", toPlay.sessionDuration); // block other ck;game calls for now

    toPlay.pregame(message, redis);
  },
};

export default game;
