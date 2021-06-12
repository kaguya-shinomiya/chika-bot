import { shiritoriGame } from "../../games/shiritori";
import { CommandCategory, PartialCommand } from "../../types/command";
import { genUsage } from "../../utils/genUsage";

const shiritoriRules: PartialCommand = {
  name: "shiritori-rules",
  aliases: ["sh-rules"],
  args: [],
  category: CommandCategory.game,
  description: "Check the rules for Shiritori.",

  async execute(message) {
    const { channel } = message;
    channel.send(shiritoriGame.rules);
  },
};

genUsage(shiritoriRules);
export default shiritoriRules;
