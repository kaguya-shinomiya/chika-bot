import { Command } from "../../types/command";

export const play: Command = {
  name: "play",
  description: "Play a game with Chika.",
  category: "Fun",
  usage: "ck!play <game>",
  argsCount: 1,
  aliases: ["p"],
  execute(message, args) {
    // TODO dispatch to the right game
    const game = args[0];
  },
};

export default play;
