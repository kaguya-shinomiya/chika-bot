import { Message } from "discord.js";
import { Game } from "../types/game";
import { sendNoTagError, sendTaggedSelfError } from "./utils/errorSenders";
import { handleOpponentResponse } from "./utils/handleOpponentResponse";

class Shiritori extends Game {
  pregame(message: Message) {
    const { channel, mentions, author } = message;
    const opponent = mentions.users.first();
    if (!opponent) {
      sendNoTagError(this.name, channel, true);
      return;
    }

    if (author.id === opponent.id) {
      sendTaggedSelfError(channel);
      return;
    }

    handleOpponentResponse(message, opponent, () =>
      console.log("challenge accepted")
    );
  }
}

export default new Shiritori("shiritori", "1v1");
