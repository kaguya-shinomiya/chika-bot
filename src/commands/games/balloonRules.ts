import { balloonGame } from "../../games/balloon";
import { Command, CommandCategory, PartialCommand } from "../../types/command";
import { genUsage } from "../../utils/genUsage";

const balloonRules: PartialCommand = {
  name: "balloon-rules",
  aliases: ["bl-rules"],
  args: [],
  category: CommandCategory.game,
  description: "Check the rules for Balloon.",

  async execute(message) {
    const { channel } = message;
    channel.send(balloonGame.rules);
  },
};

genUsage(balloonRules);
export default balloonRules as Command;
