import { PREFIX } from "../../constants";
import { shiritoriGame } from "../../games/shiritori";
import { Command } from "../../types/command";

const shiritoriRules: Command = {
  name: "shiritori-rules",
  argsCount: 0,
  category: "Game",
  description: "Check the rules for Shiritori.",
  usage: `${PREFIX}shiritori-rules`,
  execute(message) {
    const { channel } = message;
    channel.send(shiritoriGame.rules);
  },
};

export default shiritoriRules;
