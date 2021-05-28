import { chika_detective_png } from "../../assets";
import { PREFIX } from "../../constants";
import { Command } from "../../types/command";
import { capitalize } from "../../utils/text";
import { listEmbed } from "../music/utils/embeds";

export const gameList: Command = {
  name: "game-list",
  aliases: ["gl"],
  argsCount: 0,
  description: "See what games Chika can play.",
  category: "Utility",
  usage: `${PREFIX}game-list`,
  execute(message) {
    const { channel, client } = message;
    channel.send(
      listEmbed(client.gamesList.map((title) => capitalize(title)))
        .setTitle("I can play these games!")
        .setThumbnail(chika_detective_png)
        .addField(
          "\u200b",
          `You may run \`${PREFIX}game\` to start a game, or \`${PREFIX}rules\` to check rules.`
        )
    );
  },
};

export default gameList;
