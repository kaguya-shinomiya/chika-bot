import { Message } from "discord.js";
import { STOP_GAME_RE } from "../games/utils/constants";
import { lightErrorEmbed } from "../shared/embeds";
import { Event } from "../types/event";

const stopGameMessage: Event = {
  name: "message",
  once: false,
  listener(_client, redis, message: Message) {
    const { channel, author, content } = message;
    if (!STOP_GAME_RE.test(content)) return;

    redis.gamesRedis.del(channel.id).then((num) => {
      if (!num) return;
      channel.send(
        lightErrorEmbed(`**${author.username}** has stopped the game.`)
      );
    });
  },
};

export default stopGameMessage;
