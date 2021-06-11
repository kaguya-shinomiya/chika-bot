import { DEFAULT_PREFIX } from "../../shared/constants";
import { balloonGame } from "../../games/balloon";
import { checkAndBlock } from "../../games/utils/manageState";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command, CommandCategory } from "../../types/command";

const balloon: Command = {
  name: "balloon",
  aliases: ["bl"],
  argsCount: 0,
  category: CommandCategory.game,
  description: "Chika hands you a balloon and you must pump it.",
  usage: `${DEFAULT_PREFIX}balloon`,
  async execute(message) {
    checkAndBlock(balloonGame, message).then(
      () => balloonGame.pregame(message),
      (err) => message.channel.send(lightErrorEmbed(err))
    );
  },
};

export default balloon;
