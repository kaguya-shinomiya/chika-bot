import { chika_detective_png } from "../../assets";
import { PREFIX } from "../../constants";
import { baseEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { RedisPrefix } from "../../types/redis";
import { toListString } from "../music/utils/embeds";

export const gameList: Command = {
  name: "game-list",
  aliases: ["gl"],
  argsCount: 0,
  description: "See what games Chika can play.",
  category: "Utility",
  usage: `${PREFIX}game-list`,
  redis: RedisPrefix.default,
  execute(message) {
    const { channel, client } = message;
    channel.send(
      baseEmbed()
        .setTitle("I can play these games!")
        .setDescription(toListString(client.gamesList))
        .setThumbnail(chika_detective_png)
        .addField(
          "\u200b",
          `Please use \`${PREFIX}game\` to start a game, or \`${PREFIX}rules\` to check rules.`
        )
    );
  },
};

export default gameList;
