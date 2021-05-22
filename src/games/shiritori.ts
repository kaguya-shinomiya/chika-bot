import { Game } from "../types/game";

const shiritori: Game = {
  name: "shiritori",
  type: "1v1",
  pregame(message, next) {
    const { channel, mentions, author } = message;
    const opponent = mentions.users.first()!;
    channel.send(
      `${opponent.toString()}! ${author.toString()} has challenged you to a game of Shiritori!`
    );
  },
};

export default shiritori;
