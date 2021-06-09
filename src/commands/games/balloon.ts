import { PREFIX } from "../../types/constants";
import { balloonGame } from "../../games/balloon";
import { checkAndBlock } from "../../games/utils/manageState";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";

const balloon: Command = {
  name: "balloon",
  argsCount: 0,
  category: "Game",
  description: "Chika hands you a balloon and you must pump it.",
  usage: `${PREFIX}balloon`,
  execute(message) {
    checkAndBlock(balloonGame, message).then(
      () => balloonGame.pregame(message),
      (err) => message.channel.send(lightErrorEmbed(err))
    );
  },
};

export default balloon;
