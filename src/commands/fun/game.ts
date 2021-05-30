import { PREFIX } from "../../constants";
import {
  sendInGame,
  sendNoGameSelectedError,
  sendUnknownGameError,
} from "../../games/utils/embeds";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { GameType } from "../../types/game";
import { RedisPrefix } from "../../types/redis";

export const game: Command = {
  name: "game",
  description: "Play a game with Pro Gamer Chika.",
  category: "Fun",
  redis: RedisPrefix.games,
  usage: `${PREFIX}game <game_title>`,
  argsCount: -1,
  async execute(message, args, redis) {
    const { mentions, channel, client } = message;

    if (await redis!.get(channel.id)) {
      sendInGame(channel);
      return;
    }

    const requestedGame = args.join("").toLowerCase();
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

    const taggedCount = mentions.users.size;
    switch (toPlay.type) {
      case GameType.Single:
        if (taggedCount !== 0) {
          channel.send(
            lightErrorEmbed(`**${toPlay.title}** is a single player game.`)
          );
          return;
        }
        break;
      // TODO make it playable w/o tagging anyone
      case GameType.Versus:
        if (taggedCount !== 1) {
          channel.send(
            lightErrorEmbed(
              `You must tag one friend to play **${toPlay.title}** with.`
            )
          );
          return;
        }
        break;
      case GameType.Multi:
        if (taggedCount < 1) {
          channel.send(
            lightErrorEmbed(
              `Tag at least one friend to play **${toPlay.title}** with.`
            )
          );
        }
        break;
      default:
        break;
    }

    if (toPlay.pregame) {
      toPlay.pregame(message, redis!);
    }
  },
};

export default game;
