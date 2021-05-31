import { Collection, Message, Snowflake, User } from "discord.js";
import { Redis } from "ioredis";
import { baseEmbed } from "../../shared/embeds";
import { Game } from "../../types/game";

export class HappyLife extends Game {
  title = "happylife";

  minPlayerCount = 1;

  maxPlayerCount = 6;

  displayTitle = "Happy Life";

  sessionDuration = 1000 * 60 * 20; // 20 min

  rules = baseEmbed().setTitle("Happy Life :airplane_departure:");

  pregame(message: Message, redis: Redis) {
    // TODO collect players
    this.collectPlayers({
      redis,
      message,
      onTimeoutAccept: (players) => this.startGame(players, message),
    });
  }

  startGame(players: Collection<Snowflake, User>, message: Message) {
    const { channel } = message;
    this.sendParticipants(channel, players.array());
  }
}
