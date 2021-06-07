import { PREFIX } from "../../constants";
import { sendUnknownGameError } from "../../games/utils/embeds";
import { Command } from "../../types/command";

export const rules: Command = {
  name: "rules",
  description: "Show rules for a game.",
  argsCount: -2,
  category: "Utility",
  usage: `${PREFIX}rules <game>`,
  execute(message, args) {
    const { channel, client } = message;
    const gameRequested = args.join("").toLowerCase();
    const game = client.games.find((_game) => _game.title === gameRequested);
    if (!game) {
      sendUnknownGameError(gameRequested, channel);
      return;
    }
    channel.send(game.rules);
  },
};

export default rules;
