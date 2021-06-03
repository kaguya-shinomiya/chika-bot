import { Collection, Message, Snowflake, User } from "discord.js";
import { Redis } from "ioredis";
import { baseEmbed } from "../../shared/embeds";
import { Game } from "../../types/game";
import { next } from "./cards/types";
import { HappyLifeGameState } from "./gameState";

export class HappyLife extends Game {
  title = "happylife";

  displayTitle = "Happy Life";

  minPlayerCount = 1;

  maxPlayerCount = 6;

  sessionDuration = 1000 * 60 * 20; // 20 min

  rules = baseEmbed().setTitle("Happy Life :airplane_departure:");

  pregame(message: Message, redis: Redis) {
    this.collectPlayers({
      redis,
      message,
      onTimeoutAccept: (players) => this.startGame(players, message),
    });
  }

  startGame(players: Collection<Snowflake, User>, message: Message) {
    const { channel } = message;
    this.sendParticipants(channel, players.array());

    const state = new HappyLifeGameState({
      channelID: channel.id,
      players,
    });

    setTimeout(() => next(state, message), 5000);
  }
}
