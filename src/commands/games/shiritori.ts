import { PREFIX } from "../../constants";
import Shiritori from "../../games/shiritori";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { checkAndBlock } from "../../games/utils/manageState";

const shiritori: Command = {
  name: "shiritori",
  argsCount: -1,
  category: "Game",
  description: "Play a round of Shiritori.",
  usage: `${PREFIX}shiritori [opponent]`,
  execute(message) {
    checkAndBlock(Shiritori, message).then(
      () => Shiritori.pregame(message),
      (err) => message.channel.send(lightErrorEmbed(err))
    );
  },
};

export default shiritori;
