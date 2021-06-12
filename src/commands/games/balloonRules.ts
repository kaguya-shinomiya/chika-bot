import { balloonGame } from "../../games/balloon";
import { Command, CommandCategory } from "../../types/command";

const balloonRules = new Command({
  name: "balloon-rules",
  aliases: ["bl-rules"],
  args: [],
  category: CommandCategory.GAME,
  description: "Check the rules for Balloon.",

  async execute(message) {
    const { channel } = message;
    channel.send(balloonGame.rules);
  },
});

export default balloonRules;
