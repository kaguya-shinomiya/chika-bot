import { Message } from "discord.js";
import { STOP_GAME } from "../games/utils/constants";
import { lightErrorEmbed } from "../shared/embeds";
import { Event } from "../types/event";

const stopGameMessage: Event = {
  name: "message",
  once: false,
  listener({ redis }, message: Message) {
    const { content, channel, author } = message;
    if (content.toLowerCase().trim() !== STOP_GAME) return;

    redis.gamesRedis.del(channel.id).then((num) => {
      if (!num) return;
      channel.send(
        lightErrorEmbed(`**${author.username}** has stopped the game.`)
      );
    });
  },
};

export default stopGameMessage;
