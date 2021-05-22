import { MessageEmbed } from "discord.js";
import { chika_crying_jpg, chika_pink } from "../../constants";
import { Command } from "../../types/command";

export const play: Command = {
  name: "play",
  description: "Play a game with Chika.",
  category: "Fun",
  usage: "ck!play <game>",
  argsCount: 1,
  aliases: ["p"],
  execute(message, args) {
    // TODO dispatch to the right game
    const [requestedGame] = args;
    const toPlay = message.client.games.find(
      (game) => game.name === requestedGame
    );
    if (!toPlay) {
      message.channel.send(
        new MessageEmbed()
          .setColor(chika_pink)
          .setThumbnail(chika_crying_jpg)
          .setDescription(`I don't know how to play *${requestedGame}*.`)
      ); // TODO display list of games we can play
      return;
    }
    // TODO start the game
    if (toPlay.pregame) {
      toPlay.pregame(message);
    }
  },
};

export default play;
