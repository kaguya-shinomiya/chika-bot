import { Collection, Message, Snowflake, User } from "discord.js";
import { Redis } from "ioredis";
import { baseEmbed } from "../../shared/embeds";
import { Game, GameType } from "../../types/game";
import { collectPlayers } from "../utils/collectPlayers";
import { sendParticipants } from "../utils/embeds";

interface gameProps {
  message: Message;
  redis: Redis;
  players: Collection<Snowflake, User>;
}

export class HappyLife extends Game {
  title = "happylife";

  displayTitle = "Happy Life";

  type = GameType.Indie;

  rules = baseEmbed().setTitle("Happy Life :airplane_departure:");

  // eslint-disable-next-line class-methods-use-this
  pregame(message: Message, redis: Redis) {
    // TODO send start message
    collectPlayers({
      gameTitle: "Happy Life",
      maxResponses: 6,
      minResponses: 1,
      message,
      onTimeoutAccept: (players: Collection<Snowflake, User>) =>
        HappyLife.startGame({ message, players, redis }),
      // eslint-disable-next-line no-console
      onTimeoutReject: () => console.log("rejected"),
    });
  }

  static startGame(startGameParams: gameProps) {
    const {
      message: { channel },
      players,
    } = startGameParams;
    sendParticipants({
      channel,
      gameTitle: "Happy Life",
      participants: players,
    });
  }
}
