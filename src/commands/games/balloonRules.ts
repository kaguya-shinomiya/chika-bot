import { DEFAULT_PREFIX } from "../../shared/constants";
import { balloonGame } from "../../games/balloon";
import { Command, CommandCategory } from "../../types/command";

const balloonRules: Command = {
  name: "balloon-rules",
  argsCount: 0,
  category: CommandCategory.game,
  description: "Check the rules for Balloon.",
  usage: `${DEFAULT_PREFIX}ballon-rules`,
  execute(message) {
    const { channel } = message;
    channel.send(balloonGame.rules);
  },
};

export default balloonRules;
