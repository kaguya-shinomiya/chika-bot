import { DEFAULT_PREFIX } from "../../shared/constants";
import { shiritoriGame } from "../../games/shiritori";
import { checkAndBlock } from "../../games/utils/manageState";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";

const shiritori: Command = {
  name: "shiritori",
  argsCount: -1,
  category: "Game",
  description: "Play a round of Shiritori.",
  usage: `${DEFAULT_PREFIX}shiritori [opponent]`,
  execute(message) {
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
};

export default shiritori;
