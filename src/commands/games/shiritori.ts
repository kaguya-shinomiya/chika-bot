import { shiritoriGame } from "../../games/shiritori";
import { checkAndBlock } from "../../games/utils/manageState";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command, CommandCategory } from "../../types/command";

const shiritori = new Command({
  name: "shiritori",
  category: CommandCategory.GAME,
  description: "Play a round of Shiritori.",
  aliases: ["sh"],
  args: [{ name: "an_opponent", optional: true }],
  async execute(message) {
    const taggedCount = message.mentions.users.size;
    if (taggedCount && taggedCount > 1) {
      message.channel.send(
        lightErrorEmbed(
          `**Shiritori** is a 2-player game!\nPlease tag only one other player.`
        )
      );
      return;
    }

    checkAndBlock(shiritoriGame, message).then(
      () => shiritoriGame.pregame(message),
      (err) => message.channel.send(lightErrorEmbed(err))
    );
  },
});

export default shiritori;
