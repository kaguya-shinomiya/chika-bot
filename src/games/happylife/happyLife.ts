import { Collection, Message, Snowflake, User } from "discord.js";
import { Redis } from "ioredis";
import { baseEmbed } from "../../shared/embeds";
import { Game } from "../../types/game";
import { sendParticipants } from "../utils/embeds";

interface gameProps {
  message: Message;
  redis: Redis;
  players: Collection<Snowflake, User>;
}

export class HappyLife extends Game {
  title = "happylife";

  minPlayerCount = 1;

  maxPlayerCount = 6;

  displayTitle = "Happy Life";

  rules = baseEmbed().setTitle("Happy Life :airplane_departure:");

  // eslint-disable-next-line class-methods-use-this
  pregame(message: Message, redis: Redis) {
    // TODO send start message
    this.collectPlayers({
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
      participants: players.map((player) => player),
    });
  }
}
