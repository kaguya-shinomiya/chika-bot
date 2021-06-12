import { shiritoriGame } from "../../games/shiritori";
import { Command, CommandCategory } from "../../types/command";

const shiritoriRules = new Command({
  name: "shiritori-rules",
  aliases: ["sh-rules"],
  args: [],
  category: CommandCategory.GAME,
  description: "Check the rules for Shiritori.",

  async execute(message) {
    const { channel } = message;
    channel.send(shiritoriGame.rules);
  },
});

export default shiritoriRules;
