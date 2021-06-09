import { Message } from "discord.js";
import { EXIT_GAME_RE } from "../games/utils/constants";
import { blindUnblock } from "../games/utils/manageState";
import { lightErrorEmbed } from "../shared/embeds";
import { Event } from "../types/event";

const stopGameMessage: Event = {
  name: "message",
  once: false,
  listener(_client, message: Message) {
    const { channel, author, content } = message;
    if (!EXIT_GAME_RE.test(content)) return;

    blindUnblock(message).then(
      () => {
        channel.send(
          lightErrorEmbed(`**${author.username}** has stopped the game.`)
        );
      },
      (err) => channel.send(lightErrorEmbed(err))
    );
  },
};

export default stopGameMessage;
