import { PREFIX } from "../../constants";
import { sendNoGameSelectedEmbed } from "../../games/utils.ts/sendNoGameSelectedEmbed";
import { sendUnknownGameError } from "../../games/utils.ts/sendUnknownGameError";
import { Command } from "../../types/command";

export const play: Command = {
  name: "play",
  description: "Play a game with Chika.",
  category: "Fun",
  usage: `${PREFIX}play <game>`,
  argsCount: -1,
  aliases: ["p"],
  execute(message, args) {
    // TODO dispatch to the right game
    const [requestedGame] = args;
    if (!requestedGame) {
      sendNoGameSelectedEmbed(message.channel);
      return;
    }
    const toPlay = message.client.games.find(
      (game) => game.name === requestedGame.toLowerCase()
    );
    if (!toPlay) {
      sendUnknownGameError(requestedGame, message.channel);
      return;
    }
    // TODO start the game
    if (toPlay.pregame) {
      toPlay.pregame(message);
    }
  },
};

export default play;
