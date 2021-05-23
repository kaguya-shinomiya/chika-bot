import { Game } from "../types/game";
import { sendNoTagError } from "./utils.ts/sendNoTagError";
import { sendTaggedSelfError } from "./utils.ts/sendTaggedSelfError";

const shiritori: Game = {
  name: "shiritori",
  type: "1v1",
  pregame(message, next) {
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
    channel.send(
      `${opponent.toString()}! ${author.toString()} has challenged you to a game of Shiritori!`
    );
  },
};

export default shiritori;
