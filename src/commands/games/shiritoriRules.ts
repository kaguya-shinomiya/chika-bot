import { DEFAULT_PREFIX } from "../../shared/constants";
import { shiritoriGame } from "../../games/shiritori";
import { Command, CommandCategory } from "../../types/command";

const shiritoriRules: Command = {
  name: "shiritori-rules",
  argsCount: 0,
  category: CommandCategory.game,
  description: "Check the rules for Shiritori.",
  usage: `${DEFAULT_PREFIX}shiritori-rules`,
  execute(message) {
    const { channel } = message;
    channel.send(shiritoriGame.rules);
  },
};

export default shiritoriRules;
