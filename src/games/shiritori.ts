import { Message } from "discord.js";
import { Game } from "../types/game";
import { sendNoTagError, sendTaggedSelfError } from "./utils/errorSenders";
import { handleOpponentResponse } from "./utils/handleOpponentResponse";
import { v4 } from "uuid";
import { User } from "discord.js";
class Shiritori extends Game {
  pregame(message: Message) {
    const { channel, mentions, author } = message;
    const opponent = mentions.users.first();
    if (!opponent) {
      sendNoTagError(this.name, channel, true);
      return;
    }
    // if (author.id === opponent.id) {
    //   sendTaggedSelfError(channel);
    //   return;
    // }

    handleOpponentResponse(
      message,
      opponent,
      () => console.log("challenge accepted"),
      () =>
        channel.send(
          `**${opponent.username}** does not want to play Shiritori.`
        )
    );
  }

  setGameState({ client, channel }: Message, ...players: User[]) {
    const gameID = v4();
    client.gameState.set(gameID, {
      name: "shiritori",
      channelID: channel.id,
      players: players.map((player) => player.id),
    });
  }

  registerMessageListener() {}
}

export default new Shiritori("shiritori", "1v1");
